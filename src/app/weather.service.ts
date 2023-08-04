import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiUrl = 'http://localhost:5000/api/weather/weatheralerts';

  constructor(private http: HttpClient) {}

  getWeatherAlerts(latitude: number, longitude: number) {
    const weatherData = { Latitude: latitude, Longitude: longitude };
    return this.http.post<any>(this.apiUrl, weatherData);
  }
}
