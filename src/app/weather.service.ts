



import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom, interval, take } from 'rxjs';




interface Feature {
  id: string;
  properties: {
    expires: string;
    status: string;
    messageType: string;
    urgency: string;
    severity: string;
    references: { '@id': string }[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  alert: any = {};
  forecast: any = {};
  public $alertSubject = new BehaviorSubject<any>(null);
  private intervalId: any;
  private updateInterval: number = 120000;
  private displayWeather: any;
  private urgency: string = '';
  private event: string = '';
  private severity: string = '';
  private description: string = '';
  private readyToSend: Feature[] = [];
  activeFeatures: Feature[] = [];

  fileProgression = [
    'initial_alerts.json',
    'first_update.json',
    'second_update.json',
    'third_update.json',
    'fourth_update.json',
  ];

  currentFileProgressPosition = 0;

  constructor(private http: HttpClient, private injector: Injector) {  this.intervalId = interval(this.updateInterval).subscribe(() => {
    this.getWeatherAlerts();
  }); }

  async findReferencedIds(obj: any) {
    const referencedIds: string[] = [];

    obj.features.forEach((feature: any) => {
      if (feature.properties && feature.properties.references) {
        feature.properties.references.forEach((reference: string) => {
          const referenceType = typeof reference;

          if (referenceType === "string") {
            referencedIds.push(reference);
          } else if (referenceType === "object") {
            // Handle other cases if needed
          } else if (referenceType === "number") {
            // Handle other cases if needed
          }
        });
      }
    });

    return referencedIds;
  }

  async getWeatherAlerts() {
    let fileLookup = this.fileProgression[this.currentFileProgressPosition++];
    var activeFeatures: Feature[] = [];

    if (this.currentFileProgressPosition >= this.fileProgression.length) {
      this.currentFileProgressPosition = 0;
    }
    try {
      const result: any = this.http.get(`/assets/json/${fileLookup}`).pipe(take(2));
      const activeFeaturesResponse = (await lastValueFrom(result)) as { features: Feature[] };

      const referencedIds = await this.findReferencedIds(activeFeaturesResponse);

      for (const feature of activeFeaturesResponse.features) {
        const currentDate = new Date();
        const expirationDate = new Date(feature.properties.expires);

        // Check conditions for including the feature
        if (
          referencedIds.includes(feature.id) &&
          feature.properties.status === 'Actual' &&
          feature.properties.messageType !== 'Cancel' &&
          expirationDate > currentDate &&
          feature.properties.urgency === 'Immediate'
        ) {
          activeFeatures.push(feature);
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
      }


    return this.activeFeatures;
  }

  async run() {
    try {

      const response = await lastValueFrom(this.http.get<Feature>("shouldAlert.json"));
      const shouldAlert: Feature[] = Array.isArray(response) ? response : [response];

      const activeFeatures = await this.getWeatherAlerts();

      const severeOrExtremeFeatures = activeFeatures.filter(
        (feature) =>
          feature.properties.severity === "Severe" ||
          feature.properties.severity === "Extreme"
      );

      const alertedIds = new Set(shouldAlert.map((feature) => feature.id));
      const filteredSevereOrExtremeFeatures = severeOrExtremeFeatures.filter(
        (feature) => {
          const featureId = feature.id;
          const referenceIds = feature.properties.references
            ? feature.properties.references.map((reference) => reference['@id'])
            : [];

          // Check if either the feature ID or any of the reference IDs are in alertedIds
          return ![featureId, ...referenceIds].some((id) =>
            alertedIds.has(id)
          );
        }
      );

      const filterResponse = await this.http.put("shouldAlert.json",
        JSON.stringify(filteredSevereOrExtremeFeatures));

      function notifyAlert(feature: any, previousAlertedIds: Set<string>) {
        // Display feature.properties.event to the user
        console.log("Alert Event:", feature.properties.event);
        console.log("Alert Description:", feature.properties.description);
        console.log("Alert Headline:", feature.properties.headline);

        // Save featureId to alertedIds
        previousAlertedIds.add(feature.id);

        // Save reference IDs to alertedIds
        if (feature.properties?.references) {
          feature.properties.references.forEach((reference: {'@id': string}) => {
            previousAlertedIds.add(reference["@id"]);
          });
        }
      }

      const alertShowData = await lastValueFrom(this.http.get("shouldAlert.json"));
      const alertShow = alertShowData as any[];
      alertShow.forEach((alert) => {
        notifyAlert(alert, alertedIds);
      });
    } catch (error) {
      console.error(error);
    }
  }
}


