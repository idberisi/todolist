import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonItemSliding, ToastController } from '@ionic/angular';
import { NewserviceService, todoItem } from '../newservice.service';
import { Clipboard } from '@capacitor/clipboard';
import { ModalController } from '@ionic/angular';
import { NewTaskModulePage } from '../modules/new-task-module/new-task-module.page';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('slidingItems') slidingItems: IonItemSliding;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private newService: NewserviceService,
    private toastController: ToastController,
    private router: Router,
    private ref: ChangeDetectorRef,
  ) {
    this.newService.todoObservable.subscribe((items: todoItem[]) => {
      this.items = items;
    })
  }

  ngOnInit() {
    this.newService.getItems();
  }

  public items: todoItem[] = [];
  public text: string = '';
  public description: string = '';
  public edit_index: number = -1;
  public hidden: boolean = false;

  async presentModal() {
    const modal = await this.modalController.create({
      component: NewTaskModulePage
    });

    modal.onDidDismiss().then((data: any) => {
      this.ref.detectChanges();
      if (data.data != false) {
        let newItem: todoItem = data.data;
        this.newService.addItem(newItem);
        this.toast('New Task Added')
      }
    });
    return await modal.present();
  }

  private async toast(message) {
    return await this.toastController.create({
      message: message,
      position: "bottom",
      duration: 3000
    }).then(TOAST => {
      TOAST.present();
    })
  }

  public removeItem(index) {
    this.newService.removeItem(index);
    this.toast('Task Removed');
  }

  public edit(index) {

    this.slidingItems.closeOpened().then(() => {
      this.router.navigateByUrl('detail/' + index)
    })

  }

  public toggleState(index) {

    let state: boolean = !this.items[index].c;

    this.slidingItems.closeOpened().then(() => {
      this.toast('Task ' + (state ? 'Completed' : 'Incomplete'));
    
      if (state) {
        this.items[index].co = new Date().getTime();
      } else {
        this.items[index].co = false;
      }

      this.newService.markAsComplete(index, state);
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
            //console.log('Confirm Cancel: blah');
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



}
