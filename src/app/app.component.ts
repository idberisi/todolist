import { IconographyService } from './services/iconography.service';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private stroageAngular:Storage,
    private icons:IconographyService,
    ) {
    stroageAngular.create();
    icons.setNames();
  }
}
