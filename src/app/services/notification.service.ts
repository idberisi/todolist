import { todoItem } from './newservice.service';
import { Injectable } from '@angular/core';
import { CancelOptions, LocalNotifications,ScheduleOptions,LocalNotificationSchema,PermissionStatus,ScheduleResult,PendingResult, Schedule, ActionPerformed } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  public init(){

    return new Promise((resolve,reject)=>{
    
      LocalNotifications.checkPermissions().then((currentPermission:PermissionStatus)=>{
        if(currentPermission.display != "granted"){
          LocalNotifications.requestPermissions().then((currentPermission:PermissionStatus)=>{
            if(currentPermission.display != "granted"){
              reject(false);
            } else {

              LocalNotifications.addListener('localNotificationActionPerformed', (notificationAction: ActionPerformed) => {
                console.log(notificationAction);
              })

              resolve(true);
            }
          });
        } else {
          resolve(true);
        }
      }).catch(e => {
        reject(e);
      })

    });
    
  }

  public async create(task:todoItem) {

    const nowTime = new Date().getTime();

    if(parseInt(task.due) > 0) {
      if( task.due > nowTime) {

        let theSchedule:Schedule = {
          at: new Date(task.due)
        };

        let reminder: any = {
          title: 'Overdue: ' + task.t,
          body: task.d,
          id: task.cr,
          schedule: theSchedule
        }

        await LocalNotifications.schedule({
          notifications: [reminder]
        });

        return { state: true, data: reminder };
      } else {
        return { state: false, reason: "Due date in the past" };
      }
    } else {
      return { state: false, reason: "Due date is not set" };
    }
    

 
  } 

  public async destroy(task:todoItem) {
    const pending: CancelOptions = {
      notifications: [
        {
          id: task.cr,
        }
      ]
    };

    return LocalNotifications.cancel(pending);
  }

  public async getList() {
    const r:any = await LocalNotifications.getPending();
    return r;
  }

  
}
