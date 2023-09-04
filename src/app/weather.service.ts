import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { interval, take } from 'rxjs';
import * as fs from 'fs';

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

  initialAlertId!: string;

  constructor() {
    // Constructor logic here (if needed)
  }

  private async findReferencedIds(obj: {
    features: Feature[];
  }): Promise<string[]> {
    const referencedIds: string[] = [];
    obj.features.forEach((feature) => {
      feature.properties.references.forEach((reference) => {
        if (!referencedIds.includes(reference['@id'])) {
          referencedIds.push(reference['@id']);
        }
      });
    });
    return referencedIds;
  }

  private async run() {
    const dat = fs.readFileSync('first_update.json', 'utf8');
    const obj: { features: Feature[] } = JSON.parse(dat);
    const currentDate = new Date('2023-08-04T11:50:00-05:00');

    const referencedIds = await this.findReferencedIds(obj);

    const activeFeatures: Feature[] = [];
    const readyToSendIds = new Set(
      this.readyToSend.map((feature) => feature.id)
    );

    obj.features.forEach((feature) => {
      const expirationDate = new Date(feature.properties.expires);
      if (
        !referencedIds.includes(feature.id) &&
        feature.properties.status === 'Actual' &&
        feature.properties.messageType !== 'Cancel' &&
        expirationDate > currentDate &&
        feature.properties.urgency === 'Immediate'
      ) {
        activeFeatures.push(feature);
      }
    });

    const severeOrExtremeFeatures = activeFeatures.filter(
      (feature) =>
        feature.properties.severity === 'Severe' ||
        feature.properties.severity === 'Extreme'
    );

    const filteredSevereOrExtremeFeatures = severeOrExtremeFeatures.filter(
      (feature) => !readyToSendIds.has(feature.id)
    );

    fs.writeFileSync('activeFeatures.json', JSON.stringify(activeFeatures)); // list of active alert for the end user

    fs.writeFileSync(
      'readyToSend.json',
      JSON.stringify(filteredSevereOrExtremeFeatures)
    );
  }
}
