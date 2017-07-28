import { Component, OnInit } from '@angular/core';

import { SebmGoogleMap, SebmGoogleMapMarker } from 'angular2-google-maps/core';

@Component({
  selector: 'app-open-wo-map',
  template: `
    <div id="openMapTab">
      <div id="map-canvas">
        <sebm-google-map [latitude]="center_lat" [longitude]="center_lng" [zoom]="zoom" [scrollwheel]="false">
          <sebm-google-map-marker *ngFor="let marker of markers" [latitude]="marker.lat" [longitude]="marker.lng"></sebm-google-map-marker>
        </sebm-google-map>
      </div>
    </div>
  `,
  styles: [`
    .sebm-google-map-container {
      height: 100%;
    }
  `]
})
export class OpenWoMapComponent implements OnInit {

  center_lat: number = 30.2669444;
  center_lng: number = -97.7427778;
  zoom: number = 8;

  markers = [
    {
      lat: 30.399512,
      lng: -97.719732
    },
    {
      lat: 30.508193,
      lng: -97.651315
    },
    {
      lat: 30.349088,
      lng: -97.797894
    },
    {
      lat: 30.266958,
      lng: -97.745175
    }
  ]

  constructor() { }

  ngOnInit() {
  }

}
