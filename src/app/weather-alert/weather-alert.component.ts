import { Component, OnDestroy, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather-alert',
  templateUrl: './weather-alert.component.html',
  styleUrls: ['./weather-alert.component.css']
})
export class WeatherAlertComponent implements OnInit, OnDestroy {
  alert: any = {};
  private intervalId: any;
  private updateInterval: number = 60000;

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.weatherService.getWeatherAlerts(); // Initialize the alert
    this.alert = this.weatherService.alert; // Assign the alert object from the service

    this.intervalId = setInterval(() => {
      this.weatherService.getWeatherAlerts(); // Call the function repeatedly at the specified interval
      this.alert = this.weatherService.alert; // Update the alert object from the service
    }, this.updateInterval);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId); // Clear the interval when the component is destroyed
  }
}
