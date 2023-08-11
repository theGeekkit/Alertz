import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';


@Component({
  selector: 'app-weather-alert',
  templateUrl: './weather-alert.component.html',
  styleUrls: ['./weather-alert.component.css']
})
export class WeatherAlertComponent implements OnInit {
  weatherAlerts: any[] = [];

  constructor(private http: HttpClient, private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.getWeatherAlerts();
  }

  getWeatherAlerts() {
    this.weatherService.getWeatherAlerts()
      .subscribe({
        next: (response: any) => {
          let obj = response;
          let features = obj.features;

          // Filter the features
          let topLevelFeatures = features.filter((obj: any) => obj.properties.references.length <= 5);

          this.weatherAlerts = topLevelFeatures; // Update weatherAlerts with filtered data

          console.log(this.weatherAlerts.length);

          if (this.weatherAlerts.length > 0) {
            console.log(this.weatherAlerts[0].id); // Log the id of the first weather alert
          } else {
            console.log("No weather alerts available.");
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
        }
      });
  }
}



