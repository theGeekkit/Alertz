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


  constructor(public weatherService: WeatherService) { }

  ngOnInit(): void {
    this.init().then(() => console.log('initted'));

  }

  ngOnDestroy(): void {
    //clearInterval(this.intervalId);
  }


  async init() {
    this.weatherService.$alertSubject.subscribe((alert) =>  {
      this.alert = alert;
    });


    // Initialize the alert and forecast properties
    //await this.weatherService.getWeatherAlerts();
    //console.log('moving on to the next call');
    //this.weatherService.getForecast();

    //this.alert = this.weatherService.alert; // Initial assignment
    //console.log(this.alert);
    //this.forecast = this.weatherService.forecast; // Initial assignment

    
  }
}

