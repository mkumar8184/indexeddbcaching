import { Injectable } from '@angular/core';
import { IndexedDbManagerService } from './indexed-db-manager.service';

@Injectable({
    providedIn: 'root',
})
export class IndexedDbService {

    constructor(private indexedDbManager: IndexedDbManagerService) {}

    private cleanUpKeyValue(oldName: string): string {
        return oldName.replace(/[^a-zA-Z0-9]/g, "");
    }

    public async readData(key: string): Promise<any> {
        key = this.cleanUpKeyValue(key);
        const data = await this.indexedDbManager.getCachedData(key);
        return data ? data : null;
    }

    public async write(key: string, data: any, timeInSeconds: number): Promise<void> {
        key = this.cleanUpKeyValue(key);
        await this.indexedDbManager.insertCacheData(key, data, timeInSeconds * 1000);
    }

    
}
