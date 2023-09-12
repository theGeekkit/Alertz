import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';



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
  private updateInterval: number = 60000;
  private displayWeather: any;
  private urgency: string = '';
  private event: string = '';
  private severity: string = '';
  private description: string = '';
  private readyToSend: Feature[] = [];

  fileProgression = [
    'initial_alerts.json',
    'first_update.json',
    'second_update.json',
    'third_update.json',
    'fourth_update.json',
  ];

  currentFileProgressPosition = 0;

  constructor(private http: HttpClient, private injector: Injector) { }

  const findReferencedIds(obj) {
    const referencedIds: string[];
    // console.log(urgentImmediate);
    obj.features.forEach((feature: any) => {
      if (
        feature.properties.references &&
        feature.properties.references.length > 0
      ) {
        feature.properties.references.forEach((reference) => {
          if (referencedIds.includes(reference["@id"])) {
            referencedIds.push(reference["@id"]);
          }
        });
      }
    });

    return referencedIds;
  }

  // public getAlerts() {
  //   return this.$alertSubject.asObservable();
  // }

  // public setAlerts(alerts: any) {
  //   this.alert = alerts;
  //   this.$alertSubject.next(alerts);
  // }


  async function run() {
    const dat = await this.http.get("first_update.json");
    const obj = await JSON.parse(dat);
    const currentDate = new Date("2023-08-04T11:50:00-05:00");
    // console.log(currentDate);

    const referencedIds = await this.findReferencedIds(obj);

    // console.log(referencedIds);
    const activeFeatures = [];
    obj.features.forEach((feature) => {
      const expirationDate = new Date(feature.properties.expires);
      // console.log(expirationDate, currentDate);
      if (
        !referencedIds.includes(feature.id) &&
        feature.properties.status === "Actual" &&
        feature.properties.messageType !== "Cancel" &&
        expirationDate > currentDate &&
        feature.properties.urgency === "Immediate"
      )
        console.log(typeof activeFeatures[0]);
      {
        activeFeatures.push(feature);
      }
    });
    // console.log("its here", activeFeatures);


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
          ? feature.properties.references.map((reference) => reference.id)
          : [];

        // Check if either the feature ID or any of the reference IDs are in previousAlertedIds
        return ![featureId, ...referenceIds].some((id) =>
          previousAlertedIds.has(id)
        );
      }
    );

    const response = await this.http.put("shouldAlert.json",
      JSON.stringify(filteredSevereOrExtremeFeatures));


    function notifyAlert(feature, previousAlertedIds) {
      // Display feature.properties.event to the user
      console.log("Alert Event:", feature.properties.event);
      console.log("Alert Description:", feature.properties.description);
      console.log("Alert Headline:", feature.properties.headline);

      // Save featureId to alertedIds
      previousAlertedIds.add(feature.id);

      // Save reference IDs to alertedIds
      if (feature.properties.references) {
        feature.properties.references.forEach((reference) => {
          previousAlertedIds.add(reference["@id"]);
        });
      }
    }

    const alertShowData = await this.http.get("shouldAlert.json");
    const alertShow = JSON.parse(alertShowData);
    alertShow.forEach((alert) => {
      notifyAlert(alert, alertedIds);
    });
  }

  run().catch((error) => {
    console.error(error);
  });

