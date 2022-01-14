import { ActivationEnd, Router } from '@angular/router';
import { HttpcancelService } from './../services/httpcancel.service';
import { EMPTY, Observable } from 'rxjs';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
        private httpCancelService: HttpcancelService) {
        this.router.events.subscribe(event => {
            // An event triggered at the end of the activation part of the Resolve phase of routing.
            if (event instanceof ActivationEnd) {
                // Cancel pending calls
                this.httpCancelService.cancelPendingRequests();
            }
        });
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(
            request.url.includes('/home')
        ) {
            return next.handle(request).pipe(takeUntil(this.httpCancelService.onCancelPendingRequests()));
        } else {
            return next.handle(request);
        }
    }

}