import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { icons } from './icons-provider';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { es_ES, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { AuthService } from './services/auth.service';
import { errorInterceptor } from './interceptors/error.interceptor';
import { NzModalModule } from 'ng-zorro-antd/modal';

registerLocaleData(es);

export const appConfig: ApplicationConfig = {
  providers: [
    AuthService,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNzIcons(icons),
    provideNzI18n(es_ES),
    importProvidersFrom(FormsModule, NzModalModule),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([tokenInterceptor, errorInterceptor])),
  ],
};
