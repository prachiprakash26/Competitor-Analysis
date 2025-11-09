import { Store, Cluster } from '../types';

// Haversine formula to calculate distance between two lat/lon points in km
function haversineDistance(store1: { lat: number, lon: number }, store2: { lat: number, lon: number }): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = (store2.lat - store1.lat) * (Math.PI / 180);
    const dLon = (store2.lon - store1.lon) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(store1.lat * (Math.PI / 180)) * Math.cos(store2.lat * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Density-based clustering algorithm
export function clusterStores(stores: Store[], radiusInKm: number): { clusters: { stores: Store[], center: { lat: number, lon: number } }[], unclustered: Store[] } {
    const clusters: { stores: Store[], center: { lat: number, lon: number } }[] = [];
    const unclustered: Store[] = [];
    
    const unvisitedStores = new Set(stores.map(s => s.storeNumber));
    const storeMap = new Map(stores.map(s => [s.storeNumber, s]));

    stores.forEach(store => {
        if (unvisitedStores.has(store.storeNumber)) {
            const newClusterStores: Store[] = [];
            const queue = [store];
            unvisitedStores.delete(store.storeNumber);

            while(queue.length > 0) {
                const currentStore = queue.shift()!;
                newClusterStores.push(currentStore);
                
                stores.forEach(neighbor => {
                    if (unvisitedStores.has(neighbor.storeNumber)) {
                        if (haversineDistance(currentStore, neighbor) <= radiusInKm) {
                            unvisitedStores.delete(neighbor.storeNumber);
                            queue.push(neighbor);
                        }
                    }
                });
            }
            
            if (newClusterStores.length > 1) {
                const center = newClusterStores.reduce((acc, s) => ({
                    lat: acc.lat + s.lat,
                    lon: acc.lon + s.lon
                }), { lat: 0, lon: 0 });
                center.lat /= newClusterStores.length;
                center.lon /= newClusterStores.length;
                clusters.push({ stores: newClusterStores, center });
            } else {
                unclustered.push(...newClusterStores);
            }
        }
    });

    return { clusters, unclustered };
}
