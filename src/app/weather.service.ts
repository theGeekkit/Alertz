import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  lastValueFrom,
  interval,
  take,
} from 'rxjs';

interface Feature {
  id: string;
  properties: {
    expires: string;
    status: string;
    messageType: string;
    urgency: string;
    severity: string;
    references: { '@id': string }[];
    event: string;
    headline: string;
    description: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  public activeFeatures: Feature[] = [];
  public activeNotifications: Feature[] = [];

  private timeoutHandle: NodeJS.Timer;
  private updateInterval: number = 2000;
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
      this.extremeAlerts();
    }, this.updateInterval);
  }

  async findReferencedIds(obj: any) {
    const referencedIds: string[] = [];

    obj.features.forEach((feature: Feature) => {
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

    return referencedIds;
  }

  async getWeatherAlerts() {
    this.activeFeatures = [];
    let fileLookup = this.fileProgression[this.currentFileProgressPosition++];

    if (this.currentFileProgressPosition >= this.fileProgression.length) {
      this.currentFileProgressPosition = 0;
    }
    try {
      const result: any = this.http.get(`/assets/json/${fileLookup}`);

      const activeFeaturesResponse = (await lastValueFrom(result)) as {
        features: Feature[];
      };

      const referencedIds = await this.findReferencedIds(
        activeFeaturesResponse
      );

      for (const feature of activeFeaturesResponse.features) {
        const currentDate = new Date('2023-08-04T11:50:00-05:00');
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

  public confirmNotification(feature: Feature) {
    let index = this.activeNotifications.findIndex(
      (item) => item.id === feature.id
    );
    if (index !== -1) {
      this.activeNotifications.splice(index, 1);
    }
  }

  async extremeAlerts() {
    try {
      await this.getWeatherAlerts();

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

  isItNewAlerts(alert: Feature): boolean {
    const referenceIds = alert.properties.references
      ? alert.properties.references.map((reference) => reference['@id'])
      : [];

    return ![alert.id, ...referenceIds].some((id) =>
      this.previousAlertedIds.includes(id)
    );
  }

  notifyAlert(feature: Feature) {
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
