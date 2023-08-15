import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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




  constructor(private http: HttpClient, private ngZone: NgZone) {
    this.getWeatherAlerts();
    //this.getForecast();
    this.init().then(() => console.log('WeatherService, Initted'));
  }



  async init() {
    this.intervalId = setInterval(() => {
      //
      this.ngZone.run(() => {
        this.getWeatherAlerts();
        //this.weatherService.getForecast();
        // Update the properties after the asynchronous calls
        //this.alert = this.weatherService.alert;
        //this.forecast = this.weatherService.forecast;
      });
    }, this.updateInterval);
  }



  async getWeatherAlerts() {
    // GET request
///
      let fileLookup = this.fileProgression[this.currentFileProgressPosition++];
      if(this.currentFileProgressPosition >= this.fileProgression.length) {
        this.currentFileProgressPosition = 0;
      }


      try {
        const result: any = await this.http.get(`/assets/json/${fileLookup}`).toPromise();
        if (result && result.features?.length > 0) {
            this.$alertSubject.next(result.features[0]);
        } else {
            this.$alertSubject.next(null);
        }
      } catch (error) {
          console.error('An error occurred:', error);
      }




      // this.http.get(`/assets/json/${fileLookup}`).subscribe((result: any) => {
      //     console.log('got data');
      // // this.http.get('https://api.weather.gov/alerts?point=37.01161240210997,-89.60530401388498').subscribe((result: any) => {
      //   //this.http.get('https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.e0f63e7f94ee4d4044df45742aa02bfe5aaae0dc.001.1').subscribe((result: any) => {
      // // Check if 'data' exists and is not empty
      //   if (result && result.features?.length > 0) {
      //     this.alert = result.features[0];
      //   } else {
      //     this.alert = null;
      //   }
      // });


    console.log('function returned');
  }

  getForecast() {
    // GET request
    // this.http.get('https://api.weather.gov/points/37.01161240210997,-89.60530401388498').subscribe((result: any) => {
      this.http.get('https://api.weather.gov/gridpoints/PAH/96,51/forecast').subscribe((result: any) => {
      // Check if 'data' exists and is not empty
      if (result.data && result.data.length > 0) {
        this.forecast = result.data[0];}
      //  else {
      //   // Handle the case when no data is available
      //   this.forecast = null;
      // }
    });
  }
}
