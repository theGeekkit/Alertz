import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';



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

  constructor(private http: HttpClient) { }

  private async findReferencedIds(obj: any): Promise<string[]> {
    try {
      const response = await this.http.get<any>('http://example.com/api/referencedIds').toPromise();
      const data = response;
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
    // const referencedIds: string[] = [];
    // obj.features.forEach((feature) => {
    //   feature.properties.references.forEach((reference) => {
    //     if (!referencedIds.includes(reference['@id'])) {
    //       referencedIds.push(reference['@id']);
    //     }
    //   });
    // });
    // return referencedIds;
  }

  private async run() {
    const dat = readFileSync('first_update.json', 'utf8');
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

    const newReadyToSendData: Feature[] = [...]; // Replace with your new data
    this.updateReadyToSend(newReadyToSendData)

    updateReadyToSend(newData: Feature[]): void {
      this.readyToSend = newData;
      this.localStorageService.setData('readyToSend', this.readyToSend);
  }
}
