/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Environment } from './app/Environment/environment';


function loadGoogleMaps(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Avoid loading twice
    if (document.getElementById('google-maps-script')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('✅ Google Maps API loaded');
      resolve();
    };
    script.onerror = () => {
      console.error('❌ Failed to load Google Maps API');
      reject();
    };
    document.head.appendChild(script);
  });
}

loadGoogleMaps(Environment.googleMapsApiKey)
  .then(() => {
    bootstrapApplication(AppComponent, appConfig)
      .catch((err) => console.error(err));
  })
  .catch((err) => console.error('Google Maps load error:', err));
