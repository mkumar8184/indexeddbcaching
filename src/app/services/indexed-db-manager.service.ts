import { Injectable } from '@angular/core';

const storeName = 'testappCachedDB';
const dbName = "mastersets";

export interface CacheEntry {
    data: any;
    timestamp: number;
    cachedTime: number;
}

export function isExpired(entry: CacheEntry): boolean {
    const currentTime = Date.now();
    return (currentTime - entry.timestamp) > entry.cachedTime;
}

@Injectable({
    providedIn: 'root',
})
export class IndexedDbManagerService {

    private dbPromise: Promise<IDBDatabase>;

    constructor() {
        this.dbPromise = this.openIndexedDB();
    }

    private openIndexedDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, 1);

            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName);
                }
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    public async getCachedData(key: string): Promise<any> {
        const db = await this.dbPromise;
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        return new Promise<any>((resolve, reject) => {
            request.onsuccess = () => {
                const entry: CacheEntry | undefined = request.result;
                if (entry && !isExpired(entry)) {
                    resolve(entry.data);
                } else {
                    resolve(null); // Data is expired or not found
                }
            };
            request.onerror = () => reject(request.error);
        });
    }

    public async insertCacheData(key: string, data: any, cachedTime: number): Promise<void> {
        const db = await this.dbPromise;
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);

        const entry: CacheEntry = {
            data: data,
            timestamp: Date.now(),
            cachedTime: cachedTime,
        };

        store.put(entry, key);
    }

}
