import { ApiService } from './../services/api.service';
import { UserService } from './../services/user.service';
import { ItemDetailPage } from './../pages/item-detail/item-detail.page';
import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AlertController, IonItemSliding, ToastController } from '@ionic/angular';
import { NewserviceService, todoItem } from '../newservice.service';
import { ModalController } from '@ionic/angular';
import { NewTaskModulePage } from '../modules/new-task-module/new-task-module.page';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {

  @ViewChild('slidingItems') slidingItems: IonItemSliding;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private newService: NewserviceService,
    private toastController: ToastController,
    private ref: ChangeDetectorRef,
    private zone: NgZone,
    private user: UserService,
    private api: ApiService,
  ) {
    this.newService.todoObservable.subscribe((items: todoItem[]) => {
      this.zone.run(() => {
        this.items = items;
        this.loaded = true;
      })
      try {
        this.progress();
      } catch(e) {
        console.error(e)
      }

    })
  }

  ngOnInit() {
    this.newService.getItems();
  }

  ngAfterViewInit() {

  }

  public activeItem: any = false;
  public items: todoItem[] = [];
  public text: string = '';
  public description: string = '';
  public edit_index: number = -1;
  public hidden: boolean = false;
  public percentage:number =  0;
  public loaded:boolean = false;

  async presentModal() {
    const modal = await this.modalController.create({
      component: NewTaskModulePage
    });

    modal.onDidDismiss().then((data: any) => {
      this.ref.detectChanges();
      if (data.data != false) {
        let newItem: todoItem = data.data;
        this.newService.addItem(newItem);
        this.toast('New Task Added', 'success')
      }
    });
    return await modal.present();
  }

  async presentEditModal(index) {
    const modal = await this.modalController.create({
      component: ItemDetailPage,
      componentProps: {
        'item': this.items[index],
        'index': index
      }
    });

    modal.onDidDismiss().then((data: any) => {
      this.ref.detectChanges();
      if (data.data != false) {
        this.items[index] = data.data[0];
        this.items[index].c = data.data[1];
        this.newService.save();
      } else {
        this.toast("Task removed", 'danger')
      }
    });
    return await modal.present();
  }

  public async social(item) {
    this.slidingItems.closeOpened().then(() => {
      Share.share({
        title: item.t + (item.c ? ' [COMPLETE]' : ' [TODO]'),
        text: 'Title:' + item.t + "\r\nStatus: " + (item.c ? 'Complete' : 'Incomplete') + "\r\nDescripton: " + item.d + "\r\nCreated: " + item.cr + (item.c ? "\r\nCompleted:: " + item.co : ''),
        dialogTitle: 'Share this task',
      })
    })
  }

  private async toast(message: string, color: any = false) {
    return await this.toastController.create({
      message: message,
      position: "bottom",
      color: color ? color : '',
      duration: 3000
    }).then(TOAST => {
      TOAST.present();
    })
  }

  public removeItem(index) {
    this.newService.removeItem(index);
    this.toast('Task Removed', 'danger');
  }

  public edit(index) {

    this.slidingItems.closeOpened().then(() => {

      this.presentEditModal(index);

      /*      this.router.navigateByUrl('detail/' + index) */
    })

  }

  setColour(item) {
    switch (item.p) {
      case 'ellipse-outline':
        return 'success';
        break;
      case 'alert-circle-outline':
        return 'warning';
        break;
      case 'flame-outline':
        return 'danger';
        break;
    }
  }

  getP(item) {
    if (!item.c) {
      switch (item.p) {
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
    } else {
      return 'dark';
    }

  }

  async details(item) {

    const created: string = new Date(item.cr).toDateString();
    const complete: string = new Date(item.co).toDateString();
    const due: string = new Date(item.due).toDateString();

    const alert = await this.alertController.create({
      cssClass: item.co < item.due ? 'alert-ok' : 'alert-bad',
      header: 'Created: ' + created,
      subHeader: item.co ? 'Completed: ' + complete : 'Incomplete',
      message: item.due ? 'Due: ' + due : 'No due date',
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  setItem(item: todoItem) {
    this.activeItem = item;
  }

  public toggleState(item, i, e) {

    let state: boolean = e.detail.checked;
    item.c = state;
    this.items[i] = item;

    this.slidingItems.closeOpened().then(() => {
      this.toast('Task ' + (state ? 'Completed' : 'Incomplete'), state ? 'success' : 'warning');
      if (state) {
        this.items[i].co = new Date().getTime();
      } else {
        this.items[i].co = false;
      }
      this.newService.markAsComplete(i, state);
      this.newService.save()
    })
  }

  async removeAlert(index) {
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
            this.removeItem(index);
          }
        }
      ]
    });
    await alert.present();
  }

  hideComplete() {
    this.hidden = !this.hidden;
  }

  shouldHide(item) {
    let hide: boolean = false;
    if (item) {
      if (item.c && this.hidden) {
        hide = true;
      }
    }
    return hide;
  }


  private async processDownload(items: any) {
    if (items) {
      let js = JSON.stringify(items);
      const TT = await this.toastController.create({
        message: "Preparing your data",
        position: "bottom",
        color: "warning"
      })

      TT.present().then(()=>{
        Share.share({
          title: "Your Task Data",
          text: js,
          dialogTitle: 'Export List',
        })
        TT.dismiss();
      });

    }
    
  }

  progress() {
    let completedTasks = 0;
    this.items.forEach( x => {
      if(x.c) {
        completedTasks++;
      }
    })
    if(this.items.length > 0) {
      this.percentage = completedTasks / this.items.length;
    } else {
      this.percentage = 0;
    }
  }

  public async export() {
    const token = await this.user.getToken();
    this.api.apicall('auth/getList', {}, token).then((ii: any) => {
      this.processDownload(ii);
    });
  }

}
