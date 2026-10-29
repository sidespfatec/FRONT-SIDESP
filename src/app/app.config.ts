import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/auth/auth.interceptor';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';

const SidespPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#EAEBF7',
            100: '#C6C7E9',
            200: '#9EA1D8',
            300: '#767AC7',
            400: '#4A50B4',
            500: '#2229A0',
            600: '#0D1282',
            700: '#0B0F6D',
            800: '#080B58',
            900: '#050743',
            950: '#03042C'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '{primary.600}',
                    contrastColor: '#FFFFFF',
                    hoverColor: '{primary.700}',
                    activeColor: '{primary.800}'
                }
            }
        }
    }
});

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
        provideRouter(routes),

        providePrimeNG({
            theme: {
                preset: SidespPreset,
                options: {
                    darkModeSelector: '.sidesp-dark',
                    cssLayer: false
                }
            }
        })
    ]
};
