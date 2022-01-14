import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import { HttpClientModule } from '@angular/common/http';

class myErrorHandler implements ErrorHandler {
  handleError(err: Error): void {
    console.error(err.message,err.name,err.stack);
  }
} 

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    HttpClientModule,
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    IonicStorageModule.forRoot()
  ],
  providers: [
    { provide: ErrorHandler, useClass: myErrorHandler },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy,  }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
