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
    // Make a GET request
    this.http.get('https://api.weather.gov/alerts?point=37.01161240210997,-89.60530401388498').subscribe((result: any) => {
      // Check if 'data' exists and is not empty
      if (result.data && result.data.length > 0) {
        this.alert = result.data[0];
      } else {
        // Handle the case when no data is available
        this.alert = null;
      }
    });
  }

  getForecast() {
    // Make a GET request
    // this.http.get('https://api.weather.gov/points/37.01161240210997,-89.60530401388498').subscribe((result: any) => {
      this.http.get('https://api.weather.gov/gridpoints/PAH/96,51/forecast').subscribe((result: any) => {
      // Check if 'data' exists and is not empty
      if (result.data && result.data.length > 0) {
        this.forecast = result.data[0];
      } else {
        // Handle the case when no data is available
        this.forecast = null;
      }
    });
  }
}
