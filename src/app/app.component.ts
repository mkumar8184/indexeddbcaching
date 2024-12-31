import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Import HttpClient
import { Observable } from 'rxjs';  // For handling asynchronous HTTP requests
import { IndexedDbService } from './services/IndexedDbService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'indexeddbcachingapp';
  countries: any;

  constructor(private httpClient: HttpClient, private indexDbService: IndexedDbService) {

  }
  ngOnInit() {
    //load countries
    this.getCountries().subscribe(x => {
      this.countries = x;
    }
    )
  }


  getCountriesFromApi() {
    return this.httpClient.get("https://localhost:7123/api/v1/masters/" + "countries");
  }
  getCountries(forceReload = false): Observable<any> {
    const datasetKey = 'countries'; //define your key with same name with your api endpoint for better 

    // Now get the country data from the cache or API
    return this.genericGetMethod(datasetKey, () => this.getCountriesFromApi(), forceReload);

  }

  //you can move in another service if needed
  genericGetMethod<T>(
    cacheKey: string, //pass datasetkey
    apiCall: () => Observable<T>, //pass api url
    forceReload: boolean = false,// pass true if need to load api 
    cacheDuration: number = 24 * 60 * 60 // define cache timiing
  ): Observable<T> {
    return new Observable<T>((observer) => {
      if (forceReload) {

        apiCall().subscribe(
          (dataFromApi) => {

            this.indexDbService.write(cacheKey, dataFromApi, cacheDuration);
            observer.next(dataFromApi);
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
      } else {

        this.indexDbService.readData(cacheKey).then((cachedData) => {
          if (cachedData) {
            observer.next(cachedData);
            observer.complete();
          } else {
            apiCall().subscribe(
              (dataFromApi) => {
                this.indexDbService.write(cacheKey, dataFromApi, cacheDuration);
                observer.next(dataFromApi);
                observer.complete();
              },
              (error) => {
                observer.error(error);
              }
            );
          }
        });
      }
    });
  }

}
