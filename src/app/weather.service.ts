import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  alert: any = {};
  forecast: any = {};

  constructor(private http: HttpClient) {
    this.getWeatherAlerts();
    this.getForecast();
  }

  getWeatherAlerts() {
    // GET request
    // this.http.get('https://api.weather.gov/alerts?point=37.01161240210997,-89.60530401388498').subscribe((result: any) => {
      this.http.get('https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.e0f63e7f94ee4d4044df45742aa02bfe5aaae0dc.001.1').subscribe((result: any) => {
    // Check if 'data' exists and is not empty
      if (result.data && result.data.length > 0) {
        this.alert = result.data[0];
      } else {
        this.alert = null;
      }
    });
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
