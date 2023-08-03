import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { WeatherService } from './weather.service';

@Component({
  selector: 'app-weather-alert',
  templateUrl: './weather-alert.component.html',
  styleUrls: ['./weather-alert.component.css']
})
export class WeatherAlertComponent  {
  latitude: number = 0;
  longitude: number = 0;
  weatherAlerts: any[] = [];

  constructor(private http: HttpClient, private weatherService: WeatherService) { }

  getWeatherAlerts(): void {
    const apiUrl = 'https://localhost:5001/api/weather/weatheralerts'; // Replace with your API URL

    const data = {
      Latitude: this.latitude,
      Longitude: this.longitude
    };

    this.http.post<any[]>(apiUrl, data).subscribe(
      (response) => {
        this.weatherAlerts = response;
      },
      (error) => {
        console.error('Error fetching weather alerts:', error);
      }
    );
  }

}
