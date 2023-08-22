import { Component, OnDestroy, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { Observable, Subscription } from 'rxjs'; // Import Subscription

@Component({
  selector: 'app-weather-alert',
  templateUrl: './weather-alert.component.html',
  styleUrls: ['./weather-alert.component.css']
})
export class WeatherAlertComponent implements OnInit, OnDestroy {
  alert: Observable<any[]> | undefined;
  forecast: any = {};
  private alertSubscription!: Subscription; // Declare Subscription

  constructor(public weatherService: WeatherService) { }

  ngOnInit() {
    this.alertSubscription = this.weatherService.alert$.subscribe((updatedAlerts) => {
      // Handle updated alerts here
      this.alert = updatedAlerts;
      console.log('Received updated alerts:', updatedAlerts);
    });
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    this.alertSubscription.unsubscribe();
  }
}

