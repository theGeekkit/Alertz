import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather-alert',
  templateUrl: './weather-alert.component.html',
  styleUrls: ['./weather-alert.component.css']
})
export class WeatherAlertComponent implements OnInit {
  latitude: number = 0;
  longitude: number = 0;
  weatherAlerts: any[] = [];

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.getWeatherAlerts();
  }

  getWeatherAlerts(): void {
    this.weatherService.getWeatherAlerts(this.latitude, this.longitude)
      .subscribe(
        (response) => {
          this.weatherAlerts = response;
        },
        (error) => {
          console.error('Error fetching weather alerts:', error);
        }
      );
  }
}
