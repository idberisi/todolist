import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { NewserviceService, todoItem } from '../newservice.service';
//import { TodolistServiceService } from '../todolist-service.service';
import { Clipboard } from '@capacitor/clipboard';
import { ModalController } from '@ionic/angular';
import { NewTaskModulePage } from '../modules/new-task-module/new-task-module.page';








@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  
  ngOnInit() {
    this.newService.getItems();
  }

  public items:todoItem[] = [];

  public text:string='';
  public description:string='';
  public edit_index:number=-1;

  constructor(public modalController: ModalController,public alertController: AlertController,public newService:NewserviceService, public toastController: ToastController) {
    this.newService.todoObservable.subscribe((items:todoItem[])=>{
      this.items=items;
    })
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: NewTaskModulePage
    });

    modal.onDidDismiss().then((data:any)=>{
      let newItem:todoItem={t:data.c,c:false,d:data.d}
      this.newService.addItem(newItem);
    });
    return await modal.present();
  }

  public removeItem(index){
    this.newService.removeItem(index);
  }

  public edit(index){
    this.edit_index=index;
    this.text=this.items[index].t;
    this.description=this.items[index].d;
  }

  public markAsComplete(index,state){
    this.newService.markAsComplete(index,state);
  }

  public async writeToClipboard(text:string){
    console.log(text);
    await Clipboard.write({
      string: text
    });
    this.toastController.create({message:"COPY FROM CLIPBOARD",duration:3000,position:"bottom"  }).then( t => t.present() )
  }

  public async checkClipboard(){
    const { type, value } = await Clipboard.read();
    this.description=value;
    alert(`Got ${type} from clipboard: ${value}`);
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

}
