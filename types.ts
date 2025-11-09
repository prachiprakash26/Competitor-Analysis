export interface Sale {
  invoiceItemNumber: string;
  date: string;
  storeNumber: string;
  storeName: string;
  address: string;
  city: string;
  zipCode: string;
  storeLocation: string;
  countyNumber: string | null;
  county: string;
  category: string;
  categoryName: string;
  vendorNumber: string;
  vendorName: string;
  itemNumber: string;
  itemDescription: string;
  pack: number;
  bottleVolumeMl: number;
  stateBottleCost: number;
  stateBottleRetail: number;
  bottlesSold: number;
  saleDollars: number;
  volumeSoldLiters: number;
  volumeSoldGallons: number;
  lat: number;
  lon: number;
}

export interface Product {
    itemNumber: string;
    itemDescription: string;
    vendorName: string;
    categoryName: string;
    pack: number;
}

export interface Store {
    storeNumber: string;
    storeName: string;
    address: string;
    lat: number;
    lon: number;
}

export interface Competitor {
    itemNumber: string;
    itemDescription: string;
    vendorName: string;
    reasoning: string;
    confidence: number;
    competingStoreNumbers: string[];
}

export interface Cluster {
  id: string;
  name: string;
  stores: Store[];
  center: { lat: number; lon: number };
  type: 'selected' | 'competitor' | 'other';
}

export interface MapPoint extends Store {
  type: 'selected' | 'competitor' | 'other';
}