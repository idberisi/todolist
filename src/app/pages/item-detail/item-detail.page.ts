import { NotificationService } from './../../services/notification.service';
import { IconographyService } from './../../services/iconography.service';
import { TodolistServiceService } from './../../todolist-service.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { AlertController, IonToggle, ModalController, IonDatetime, IonSelect, ToastController } from '@ionic/angular';
import { NewserviceService } from 'src/app/newservice.service';

import { LocalNotifications, PendingResult } from '@capacitor/local-notifications';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
})
export class ItemDetailPage implements OnInit, AfterViewInit {

  @ViewChild('completed') completed: IonToggle;
  @ViewChild('tabs') tabs: ElementRef;
  @ViewChild('dt') datetime: IonDatetime;
  @ViewChild('select') select: IonSelect;

  public icons: string[] = [];
  public selected: string = '';
  public iconsLoaded: boolean = false;
  public levelname: string = '';

  public chkd: boolean = false;

  @Input() item: any;
  @Input() index: number;

  constructor(
    private alertController: AlertController,
    private newService: NewserviceService,
    private todoStorage: TodolistServiceService,
    private iconService: IconographyService,
    private modalController: ModalController,
    private notifications: NotificationService,
    private toastController: ToastController,



  ) {


  }

  ngOnInit() {
    this.iconService.getNames().then((names: any) => {
      if (names) { this.icons = names }
    });
  }


  ngAfterViewInit() {
    this.completed.ionChange.subscribe((v: any) => {
      this.chkd = v.detail.checked;
      if (v.detail.checked) {
        this.item.co = new Date().getTime();
      } else {
        this.item.co = false;
      }
    })

    let dateTime: any = '';

    if (!this.item.due) {
      dateTime = new Date().toISOString();
    } else {
      dateTime = new Date(this.item.due).toISOString().replace("Z", "");
    }

    this.datetime.min = dateTime;
    this.datetime.value = dateTime;

  }




  ionViewWillEnter() {
    this.iconService.getNames().then((icons: any) => {
      this.icons = icons;
      this.iconsLoaded = true;
    });

    this.levelname = this.setLevel();

  }

  changeState(e) {
    this.item.c = e.detail.checked;
  }

  async handleNotification() {

    if (this.item.remind) {
      const list:PendingResult = await this.notifications.getList();
      list.notifications.forEach(n => {
        if(n.id == this.item.cr) {
          this.notifications.destroy(this.item).then(()=>{
            this.notifications.create(this.item);
            this.toastController.create(
              {
                message: "Edited " + this.item.title + " reminder",
                duration: 3000,
                position: "bottom",
                color: 'danger'
              }
            ).then(t => t.present());
          });
        }
      })
    }

    if (!this.item.remind) {
      const list:PendingResult = await this.notifications.getList();
      list.notifications.forEach(n => {
        if(n.id == this.item.cr) {
          this.notifications.destroy(this.item).then(()=>{
            this.toastController.create(
              {
                message: "Removed " + this.item.title + " reminder",
                duration: 3000,
                position: "bottom",
                color: 'danger'
              }
            ).then(t => t.present());
          })
        }
      })
    }
  }

  async test() {

    


    


  }

  async changeReminder(e) {

    await this.notifications.init().then((value: boolean) => {
      if (value) {
        this.notifications.create(this.item).then((result: any) => {
          if (result.state) {
            this.item.remind = e.detail.checked;
          } else {
            if (e.detail.checked) {
              this.toastController.create(
                {
                  message: result.reason,
                  duration: 3000,
                  position: "bottom",
                  color: 'warning'
                }
              ).then(t => t.present());
            }
          }
        })
      } else {
        // notitify user that we dont have permission for this feature
      }
    })



  }

  changePriority(e) {
    this.item.p = e.detail.value;
    this.levelname = this.setLevel();
  }

  public changeDue(e) {
    this.item.due = Date.parse(e.detail.value);
  }

  public changeTitle(e) {
    this.item.t = e.detail.value;
  }

  public changeDescription(e) {
    this.item.d = e.detail.value;
  }

  changeP() {
    this.select.open();
  }

  setLevel() {
    switch (this.item.p) {
      case 'ellipse-outline':
        return 'low';
        break;
      case 'alert-circle-outline':
        return 'medium';
        break;
      case 'flame-outline':
        return 'high';
        break;
    }
  }

  public async updateItem() {
    // this.handleNotification();
    this.newService.updateItem(this.item, this.index);
    this.modalController.dismiss([this.item, this.chkd]);
  }

  async removeAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Are you sure ?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            return true;
          }
        }, {
          text: 'Yes',
          id: 'confirm-button',
          handler: () => {
            this.removeItem();
          }
        }
      ]
    });
    await alert.present();
  }

  public removeItem() {
    this.newService.removeItem(this.index);
    this.modalController.dismiss(false);
  }

  public updateItemDetail() {
    this.todoStorage.setCurrent(this.item);
  }

  public selectedIcon(icon) {
    this.selected = icon;
    this.item.i = icon;
  }
}

