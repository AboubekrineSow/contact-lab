import { bootstrapApplication } from '@angular/platform-browser';
import { ModuleRegistry, ClientSideRowModelModule } from 'ag-grid-community';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// ag-Grid v32 is modular: register the row model we use.
ModuleRegistry.registerModules([ClientSideRowModelModule]);

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
