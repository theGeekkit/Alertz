import { Component, OnDestroy, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { Subscription } from 'rxjs'; // Import Subscription

@Component({
  selector: 'app-weather-alert',
  templateUrl: './weather-alert.component.html',
  styleUrls: ['./weather-alert.component.css']
})
export class WeatherAlertComponent implements OnInit, OnDestroy {
  alert: any = {};
  forecast: any = {};
  private alertSubscription!: Subscription; // Declare Subscription

  constructor(public weatherService: WeatherService) { }

  ngOnInit(): void {
    this.alertSubscription = this.weatherService.alert$.subscribe((alert) => {
      this.alert = alert;
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.alertSubscription.unsubscribe();
  }
}
