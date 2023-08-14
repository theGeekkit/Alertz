import { Component, OnDestroy, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather-alert',
  templateUrl: './weather-alert.component.html',
  styleUrls: ['./weather-alert.component.css']
})
export class WeatherAlertComponent implements OnInit, OnDestroy {
  alert: any = {};
  forecast: any = {};

  private intervalId: any;
  private updateInterval: number = 60000;

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    // Initialize the alert and forecast properties
    this.weatherService.getWeatherAlerts();
    this.weatherService.getForecast();

    this.alert = this.weatherService.alert; // Initial assignment
    this.forecast = this.weatherService.forecast; // Initial assignment

    this.intervalId = setInterval(() => {
      this.weatherService.getWeatherAlerts();
      this.weatherService.getForecast();

      // Update the properties after the asynchronous calls
      this.alert = this.weatherService.alert;
      this.forecast = this.weatherService.forecast;
    }, this.updateInterval);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}

