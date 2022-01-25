import { Injectable } from '@angular/core';
import { LocalNotifications,ScheduleOptions,LocalNotificationSchema,PermissionStatus,ScheduleResult,PendingResult } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  

  constructor() { }

  public async init(){
    const currentPermission:PermissionStatus=await LocalNotifications.checkPermissions();
    if(currentPermission.display!="granted"){
      LocalNotifications.requestPermissions();
    }
  }
}
