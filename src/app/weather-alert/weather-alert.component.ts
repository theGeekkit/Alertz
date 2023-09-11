import { Component, OnDestroy, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { Subscription } from 'rxjs'; // Import Subscription

@Component({
  selector: 'app-weather-alert',
  templateUrl: './weather-alert.component.html',
  styleUrls: ['./weather-alert.component.css']
})
export class WeatherAlertComponent implements OnInit {
  alert: any = {};
  forecast: any = {};
  private alertSubscription!: Subscription; // Declare Subscription

  constructor(public weatherService: WeatherService) { }

  ngOnInit(): void {
    this.fetchData();
  }
  async fetchData() {
    const jsonData = await this.weatherService.readyToSend();
    if (jsonData) {
      // Work with the JSON data here
      console.log('Fetched JSON data:', jsonData);
    } else {
      // Handle the error
      console.error('Failed to fetch JSON data.');
    }
  }
}
