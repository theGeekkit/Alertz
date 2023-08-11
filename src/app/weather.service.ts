import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiUrl = 'http://localhost:5000/api/weather/weatheralerts';

  constructor(private http: HttpClient) {}

  getWeatherAlerts() {
    // Make a GET request
    const apiUrl = 'https://api.weather.gov/alerts?point=37.01161240210997,-89.60530401388498';
      return this.http.get(apiUrl);

  }
}
