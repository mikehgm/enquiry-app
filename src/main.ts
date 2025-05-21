import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { AppConfigService } from './app/service/app-config.service';

bootstrapApplication(AppComponent, {
  ...appConfig,
}).then(appRef => {
  const injector = appRef.injector;
  const appConfigService = injector.get(AppConfigService);
  return appConfigService.loadConfig();
});
