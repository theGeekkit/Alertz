

import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs'; // Import Observable
import { interval, take, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  alert: any = {};
 forecast: any = {};
 public $alertSubject = new BehaviorSubject<any>(null);
 private intervalId: any;
 private updateInterval: number = 60000;

 fileProgression = [
  'initial_alerts.json',
  'first_update.json',
  'second_update.json',
  'third_update.json',
  'fourth_update.json',
 ];

  currentFileProgressPosition = 0;

 initialAlertId!: string;


  // Use Observable instead of BehaviorSubject

  private alertSubject = new BehaviorSubject<any>(null);
  public alert$: Observable<any> = this.alertSubject.asObservable(); // Expose as an Observable

  constructor(private http: HttpClient, private ngZone: NgZone) {
    this.getWeatherAlerts();
    this.init().then(() => console.log('WeatherService, Initted'));
  }

 async init() {
  this.intervalId = setInterval(() => {
   this.ngZone.run(() => {
    this.getWeatherAlerts();

   });
  }, this.updateInterval);
 }

 async getWeatherAlerts() {
  let fileLookup = this.fileProgression[this.currentFileProgressPosition++];
  if (this.currentFileProgressPosition >= this.fileProgression.length) {
   this.currentFileProgressPosition = 0;
  //  console.log("getWeatherAlert1")
  }

  try {
    const result: any = this.http.get(`/assets/json/${fileLookup}`).pipe(take(2));
    const weatherBlob = (await lastValueFrom(result)) as any;
    console.log(weatherBlob.features);

    // console.log(`The last data is ${weatherResult}`);

  //  const result: any = await this.http.get(`/assets/json/${fileLookup}`).toPromise();
  //  if (result && result.features?.length > 0) {
  //   const alerts = result.features.map((feature: any) => {
  //    return {
  //     id: feature.id,
  //     areaDesc: feature.properties.areaDesc,
  //     severity: feature.properties.severity,

  //     // Add other properties you want to extract here
  //    };
  //   });

  //   this.initialAlertId = alerts[0].id;
  //   this.$alertSubject.next(alerts);

  //   // Call the checkForAlertUpdates here
  //   this.checkForAlertUpdates(result.features);
  //  } else {
  //   this.$alertSubject.next(null);
  //  }
  } catch (error) {
   console.error('An error occurred:', error);
  }
  console.log('function returned');
 }


 async checkForAlertUpdates(alertFeatures: any[]) {
  try {
    let fileLookup = this.fileProgression[this.currentFileProgressPosition++];
    if (this.currentFileProgressPosition >= this.fileProgression.length) {
      this.currentFileProgressPosition = 0;
      console.log("CheckforAlertUpdate2")
    }

    const result: any = await this.http.get(`/assets/json/${fileLookup}`).toPromise();
    if (result && result.features?.length > 0) {
      const updatedAlerts = result.features.filter((feature: any) => {
        return (
          feature.properties.references.includes(this.initialAlertId) &&
          feature.properties.messageType === 'Update'
        );
      });

      if (updatedAlerts.length > 0) {
        // Emit updated alerts through the Observable
        this.alertSubject.next(updatedAlerts);
      }
    } else {
      console.warn('Received invalid or unexpected data format:', result);
    }
  } catch (error) {
    console.error('An error occurred while checking for updates:', error);
  }
  async function execute() {
    const source$ = interval(2000).pipe(take(5));
    const finalNumber = await lastValueFrom(source$);
    console.log(`The last data is ${finalNumber}`);
  }
  execute();
}








 // getForecast() {
 //   // GET request
 //   // this.http.get('https://api.weather.gov/points/37.01161240210997,-89.60530401388498').subscribe((result: any) => {
 //     this.http.get('https://api.weather.gov/gridpoints/PAH/96,51/forecast').subscribe((result: any) => {
//     // Check if 'data' exists and is not empty
 //     if (result.data && result.data.length > 0) {
//       this.forecast = result.data[0];}
 //     //  else {
 //     //   // Handle the case when no data is available
 //     //   this.forecast = null;
 //     // }
//   });
 // }

}
