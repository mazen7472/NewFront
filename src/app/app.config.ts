import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Environment } from './Environment/environment';

import { routes } from './app.routes';

// HTTP interceptor to handle SSL issues in development
import { HttpInterceptorFn } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { GoogleMapsModule } from '@angular/google-maps';

// ✅ import provideGoogleMaps

const sslBypassInterceptor: HttpInterceptorFn = (req, next) => {
  // Only apply in development and for HTTPS URLs
  if (
    Environment.isDevelopment &&
    Environment.bypassSSLVerification &&
    req.url.startsWith('https://')
  ) {
    console.log(
      '🔧 Development mode: Bypassing SSL verification for:',
      req.url
    );
  }
  return next(req);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([sslBypassInterceptor])),
    provideClientHydration(),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-top-left',
      timeOut: 2000,
      progressBar: true,
      closeButton: true,
      preventDuplicates: true,
    }),
    provideAnimationsAsync(),
    importProvidersFrom(GoogleMapsModule),
  ],
};
