import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './interceptor';
import { HttpcancelService } from './services/httpcancel.service';
import { HttpRequestInterceptor } from './interceptor/http.interceptor';

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
    HttpcancelService,
    { provide: ErrorHandler, useClass: myErrorHandler },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy,  },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi:true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
