import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { WeatherAlertComponent } from './weather-alert/weather-alert.component';

@NgModule({
  declarations: [
    AppComponent,
    WeatherAlertComponent // Add WeatherAlertComponent here
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
