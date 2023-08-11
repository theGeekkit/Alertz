import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import axios from 'axios';

@Component({
  selector: 'app-weather-alert',
  templateUrl: './weather-alert.component.html',
  styleUrls: ['./weather-alert.component.css']
})
export class WeatherAlertComponent implements OnInit {
  latitude: number = 0;
  longitude: number = 0;
  weatherAlerts: any[] = [];

  constructor(private http: HttpClient, private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.getWeatherAlerts();
  }

  async getWeatherAlerts() {
    // Make a GET request
    try {
      let response = await axios.get('https://api.weather.gov/alerts?point=37.01161240210997,-89.60530401388498');

      let obj = response.data;
      let features = obj.features;

      // Filter the features
      let topLevelFeatures = features.filter((obj: any) => obj.properties.references.length <= 5);

      obj.features = topLevelFeatures;

      // Write the data to a JSON file (note: this isn't suitable for Angular client-side apps)
      // writeFileSync('fourth_update.json', JSON.stringify(obj));

      console.log(topLevelFeatures.length);

      console.log(response.data);
      let data = response.data;
      console.log(data.features.length);
      data.features.forEach((feature: { id: any; }) => {
        console.log(feature.id);
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
