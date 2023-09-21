import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { IFeature } from './interfaces/i-feature';

import {
  BehaviorSubject,
  Observable,
  lastValueFrom,
  interval,
  take,
} from 'rxjs';

const DEBUG: boolean = false;

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  public activeFeatures: IFeature[] = [];
  public activeNotifications: IFeature[] = [];
  private timeoutHandle: NodeJS.Timer;
  private updateInterval: number = DEBUG ? 2000 : 60000;
  private previousAlertedIds: string[] = [];

  fileProgression = [
    'initial_alerts.json',
    'first_update.json',
    'second_update.json',
    'third_update.json',
    'fourth_update.json',
  ];

  currentFileProgressPosition = 0;

  constructor(private http: HttpClient, private injector: Injector) {
    this.timeoutHandle = setInterval(() => {
      this.refreshWeatherAlerts();
    }, this.updateInterval);
  }

  async findReferencedIds(obj: any) {
    const referencedIds: string[] = [];

    if (obj.features && Array.isArray(obj.features)) {
      obj.features.forEach((feature: IFeature) => {
      if (feature.properties && feature.properties.references) {
        feature.properties.references.forEach((reference: any) => {
          const referenceType = typeof reference;
          if (referenceType === 'object') {
            referencedIds.push(reference['@id']);
          } else if (referenceType === 'undefined') {
            // Handle other cases if needed
          } else if (referenceType === 'number') {
            // Handle other cases if needed
          }
        });
      }
    });
  }

    return referencedIds;
  }

  async refreshWeatherAlerts() {
    try {
      await this.fetchWeatherAlerts();

      const severeOrExtremeFeatures = this.activeFeatures.filter(
        (feature) =>
          feature.properties.severity === 'Severe' ||
          feature.properties.severity === 'Extreme'
      );

      const filteredSevereOrExtremeFeatures = severeOrExtremeFeatures.filter(
        (feature) => this.isItNewAlerts(feature)
      );

      filteredSevereOrExtremeFeatures.forEach((alert) => {
        this.notifyAlert(alert);
      });
    } catch (error) {
      console.error(error);
    }
  }

  async fetchWeatherAlerts() {
    this.activeFeatures = [];
    let lookupURL =
      'https://api.weather.gov/points/42.495132,-96.400070';
    if (DEBUG) {
      let fileLookup = this.fileProgression[this.currentFileProgressPosition++];

      if (this.currentFileProgressPosition >= this.fileProgression.length) {
        this.currentFileProgressPosition = 0;
      }
      lookupURL = `/assets/json/${fileLookup}`;
    }
    try {
      const result$: any = this.http.get(lookupURL);

      const activeFeaturesResponse = (await lastValueFrom(result$)) as {
        features: IFeature[];
      };

      const referencedIds = await this.findReferencedIds(
        activeFeaturesResponse
      );
      let currentDate = new Date();
      if (DEBUG) {
        currentDate = new Date('2023-08-04T11:50:00-05:00');
      }
      for (const feature of activeFeaturesResponse.features) {
        const expirationDate = new Date(feature.properties.expires);
        console.log(feature);

        if (
          !referencedIds.includes(feature.id) &&
          feature.properties.status === 'Actual' &&
          feature.properties.messageType !== 'Cancel' &&
          expirationDate > currentDate
        ) {
          this.activeFeatures.push(feature);
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  public confirmNotification(feature: IFeature) {
    let index = this.activeNotifications.findIndex(
      (item) => item.id === feature.id
    );
    if (index !== -1) {
      this.activeNotifications.splice(index, 1);
    }
  }

  isItNewAlerts(alert: IFeature): boolean {
    const referenceIds = alert.properties.references
      ? alert.properties.references.map((reference) => reference['@id'])
      : [];

    return ![alert.id, ...referenceIds].some((id) =>
      this.previousAlertedIds.includes(id)
    );
  }

  notifyAlert(feature: IFeature) {
    // Save featureId to alertedIds
    this.previousAlertedIds.push(feature.id);

    // Save reference IDs to alertedIds
    if (feature.properties?.references) {
      feature.properties.references.forEach((reference: { '@id': string }) => {
        this.previousAlertedIds.push(reference['@id']);
      });
    }
    this.activeNotifications.push(feature);
  }
}
