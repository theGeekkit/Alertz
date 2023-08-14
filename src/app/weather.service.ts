import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiUrl = 'https://api.weather.gov/alerts?point=37.01161240210997,-89.60530401388498';

  constructor(private http: HttpClient) {}

  getWeatherAlerts() {
    // Make a GET request
    return this.http.get(this.apiUrl);
  }
}
