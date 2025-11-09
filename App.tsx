import React, { useState, useEffect, useMemo } from 'react';
import { parseSalesData } from './data/syntheticData';
import { findCompetitors, nameCluster } from './services/geminiService';
import { clusterStores } from './utils/clustering';
import { Sale, Product, Store, Competitor, Cluster, MapPoint } from './types';
import StoreMap from './components/Map';
import { LoadingSpinner, SearchIcon, MapPinIcon } from './components/Icons';

const ClusterDetails: React.FC<{
  cluster: Cluster;
  data: { itemDescription: string; bottlesSold: number; saleDollars: number }[];
  onClose: () => void;
}> = ({ cluster, data, onClose }) => (
  <div className="bg-base-200 rounded-lg p-4 mb-6 relative border border-base-300">
    <button onClick={onClose} className="absolute top-3 right-3 text-content-200 hover:text-content-100 font-bold text-2xl leading-none" aria-label="Close cluster details">&times;</button>
    <h3 className="text-lg font-semibold mb-3">{cluster.name} ({cluster.stores.length} stores)</h3>
    <div className="max-h-60 overflow-y-auto pr-2">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-content-200 uppercase bg-base-300">
          <tr>
            <th scope="col" className="px-4 py-2">Product</th>
            <th scope="col" className="px-4 py-2 text-right">Bottles Sold</th>
            <th scope="col" className="px-4 py-2 text-right">Total Sales</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.itemDescription} className="border-b border-base-300">
              <td className="px-4 py-2 font-medium">{item.itemDescription}</td>
              <td className="px-4 py-2 text-right">{item.bottlesSold.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">${item.saleDollars.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

function App() {
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
  const [namedClusters, setNamedClusters] = useState<Cluster[]>([]);
  const [isNamingClusters, setIsNamingClusters] = useState<boolean>(false);

  useEffect(() => {
    const allSales = parseSalesData();
    setSalesData(allSales);

    const uniqueProducts = Array.from(new Map(allSales.map(s => [s.itemNumber, {
      itemNumber: s.itemNumber,
      itemDescription: s.itemDescription,
      vendorName: s.vendorName,
      categoryName: s.categoryName,
      pack: s.pack
    }])).values());
    setProducts(uniqueProducts);

    const uniqueStores = Array.from(new Map(allSales.map(s => [s.storeNumber, {
        storeNumber: s.storeNumber,
        storeName: s.storeName,
        address: s.address,
        lat: s.lat,
        lon: s.lon,
    }])).values());
    setStores(uniqueStores);
  }, []);

  const handleProductSelect = async (product: Product) => {
    if (selectedProduct?.itemNumber === product.itemNumber) return;
    
    setSelectedProduct(product);
    setIsLoading(true);
    setError(null);
    setCompetitors([]);
    setSelectedCluster(null);

    try {
      const result = await findCompetitors(product, salesData);
      setCompetitors(result);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => p.itemDescription.toLowerCase().includes(filter.toLowerCase()))
      .sort((a,b) => a.itemDescription.localeCompare(b.itemDescription));
  }, [products, filter]);

  const { rawClusters, unclusteredStores } = useMemo(() => {
    if (stores.length === 0) return { rawClusters: [], unclusteredStores: [] };
    const CLUSTER_RADIUS_KM = 1.5;
    const { clusters, unclustered } = clusterStores(stores, CLUSTER_RADIUS_KM);
    return { rawClusters: clusters, unclusteredStores: unclustered };
  }, [stores]);

  useEffect(() => {
    if (rawClusters.length > 0) {
        const nameAllClusters = async () => {
            setIsNamingClusters(true);
            try {
                const named = await Promise.all(
                    rawClusters.map(async (cluster, index) => {
                        const name = await nameCluster(cluster.stores);
                        return {
                            ...cluster,
                            id: `cluster-${index}`,
                            name: name,
                            type: 'other' as const
                        };
                    })
                );
                setNamedClusters(named as Cluster[]);
            } catch (e) {
                console.error("Failed to name clusters", e);
                const fallbackNamed = rawClusters.map((cluster, index) => ({
                     ...cluster,
                     id: `cluster-${index}`,
                     name: `Cluster ${index + 1}`,
                     type: 'other' as const
                }));
                setNamedClusters(fallbackNamed as Cluster[]);
            } finally {
                setIsNamingClusters(false);
            }
        };
        nameAllClusters();
    } else {
        setNamedClusters([]);
    }
}, [rawClusters]);
  
  const { mapClusters, mapUnclusteredStores } = useMemo(() => {
      const getStoreType = (storeNumber: string): 'selected' | 'competitor' | 'other' => {
          if (!selectedProduct) return 'other';
          const selectedProductStoreNumbers = new Set(salesData.filter(s => s.itemNumber === selectedProduct.itemNumber).map(s => s.storeNumber));
          const competitorStoreNumbers = new Set(competitors.flatMap(c => c.competingStoreNumbers));
          
          if (selectedProductStoreNumbers.has(storeNumber)) return 'selected';
          if (competitorStoreNumbers.has(storeNumber)) return 'competitor';
          return 'other';
      };

      const clusters: Cluster[] = namedClusters.map((c) => {
        const storeTypes = c.stores.map(s => getStoreType(s.storeNumber));
        let clusterType: 'selected' | 'competitor' | 'other' = 'other';
        if (storeTypes.includes('selected')) {
            clusterType = 'selected';
        } else if (storeTypes.includes('competitor')) {
            clusterType = 'competitor';
        }
        return { ...c, type: clusterType };
      });

      const unclustered: MapPoint[] = unclusteredStores.map(s => ({
          ...s,
          type: getStoreType(s.storeNumber)
      }));

      return { mapClusters: clusters, mapUnclusteredStores: unclustered };
  }, [selectedProduct, competitors, namedClusters, unclusteredStores, salesData]);

  const handleClusterClick = (cluster: Cluster) => {
    setSelectedCluster(cluster);
  }

  const aggregatedClusterData = useMemo(() => {
    if (!selectedCluster) return null;

    const storeNumbersInCluster = new Set(selectedCluster.stores.map(s => s.storeNumber));
    const salesInCluster = salesData.filter(s => storeNumbersInCluster.has(s.storeNumber));

    const productSales = new Map<string, { itemDescription: string, bottlesSold: number, saleDollars: number }>();

    salesInCluster.forEach(sale => {
        const existing = productSales.get(sale.itemNumber);
        if (existing) {
            existing.bottlesSold += sale.bottlesSold;
            existing.saleDollars += sale.saleDollars;
        } else {
            productSales.set(sale.itemNumber, {
                itemDescription: sale.itemDescription,
                bottlesSold: sale.bottlesSold,
                saleDollars: sale.saleDollars
            });
        }
    });

    return Array.from(productSales.values()).sort((a, b) => b.saleDollars - a.saleDollars);
  }, [selectedCluster, salesData]);


  return (
    <div className="flex flex-col md:flex-row h-screen font-sans bg-base-100 text-content-100">
      {/* Left Panel: Product List */}
      <aside className="w-full md:w-1/3 lg:w-1/4 border-r border-base-300 flex flex-col h-full">
        <div className="p-4 border-b border-base-300">
          <h1 className="text-xl font-bold text-content-100">Product Analysis</h1>
          <p className="text-sm text-content-200">Select a product to find competitors</p>
          <div className="relative mt-4">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-content-200" />
            <input
              type="text"
              placeholder="Search products..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-base-200 border border-base-300 rounded-lg pl-10 pr-4 py-2 text-content-100 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
            />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto">
          {filteredProducts.map(product => (
            <div
              key={product.itemNumber}
              onClick={() => handleProductSelect(product)}
              className={`p-4 cursor-pointer border-l-4 ${selectedProduct?.itemNumber === product.itemNumber ? 'border-brand-secondary bg-base-200' : 'border-transparent hover:bg-base-200/50'}`}
            >
              <p className="font-semibold text-content-100">{product.itemDescription}</p>
              <p className="text-sm text-content-200">{product.vendorName} ({product.pack} pack)</p>
            </div>
          ))}
        </div>
      </aside>

      {/* Right Panel: Analysis View */}
      <main className="w-full md:w-2/3 lg:w-3/4 flex flex-col p-4 md:p-6 lg:p-8 overflow-y-auto">
        {!selectedProduct ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <MapPinIcon className="w-24 h-24 text-base-300" />
            <h2 className="mt-4 text-2xl font-bold">Select a Product</h2>
            <p className="mt-2 text-content-200">Choose a product from the list on the left to begin your competitor analysis.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-content-100">{selectedProduct.itemDescription}</h2>
              <p className="text-md text-content-200">{selectedProduct.vendorName} / {selectedProduct.categoryName}</p>
            </div>

            <div className="bg-base-200 rounded-lg p-4 mb-6 border border-base-300">
                 <h3 className="text-lg font-semibold mb-2">Store Distribution Map</h3>
                 <p className="text-sm text-content-200 mb-4">Stores are clustered by proximity. Click a cluster to see aggregated sales data.</p>
                 <div className="flex items-center space-x-4 text-sm mb-4">
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-600 mr-2"></span>Selected Product</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>Competitor</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-slate-600 mr-2"></span>Other</div>
                 </div>
                 <div className="w-full h-64 md:h-96 bg-base-100 rounded relative">
                    {isNamingClusters && 
                        <div className="absolute inset-0 bg-base-100/70 flex items-center justify-center z-10">
                           <LoadingSpinner className="w-8 h-8"/>
                           <p className="ml-3">Naming clusters...</p> 
                        </div>
                    }
                    <StoreMap clusters={mapClusters} unclusteredStores={mapUnclusteredStores} width={800} height={400} onClusterClick={handleClusterClick} />
                 </div>
            </div>
            
            {selectedCluster && aggregatedClusterData && (
                <ClusterDetails
                    cluster={selectedCluster}
                    data={aggregatedClusterData}
                    onClose={() => setSelectedCluster(null)}
                />
            )}
            
            <h3 className="text-xl font-semibold mb-4">Competitor Analysis</h3>

            {isLoading && (
              <div className="flex flex-col items-center justify-center text-center p-8">
                <LoadingSpinner className="w-12 h-12 text-brand-secondary" />
                <p className="mt-4 text-content-200">Analyzing data with Gemini...</p>
              </div>
            )}
            {error && <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg p-4">{error}</div>}
            
            {!isLoading && !error && competitors.length === 0 && (
                <div className="text-center p-8 bg-base-200 rounded-lg">
                    <p className="text-content-200">Analysis complete. No direct competitors found based on the criteria.</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {competitors.map(comp => (
                <div key={comp.itemNumber} className="bg-base-200 rounded-lg p-5 border border-base-300 shadow-lg flex flex-col">
                  <h4 className="font-bold text-lg text-content-100">{comp.itemDescription}</h4>
                  <p className="text-sm text-content-200 mb-3">{comp.vendorName}</p>
                  <div className="text-sm bg-base-300/50 p-3 rounded-md flex-grow">
                    <p className="whitespace-pre-wrap font-sans">{comp.reasoning}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-content-200 mb-1">CONFIDENCE</p>
                    <div className="w-full bg-base-300 rounded-full h-2.5">
                        <div className="bg-brand-secondary h-2.5 rounded-full" style={{width: `${comp.confidence}%`}}></div>
                    </div>
                    <p className="text-right text-sm font-bold mt-1">{comp.confidence}%</p>
                  </div>
                  <p className="text-xs mt-3 text-content-200 border-t border-base-300 pt-3">Sold in {comp.competingStoreNumbers.length} competing stores.</p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;