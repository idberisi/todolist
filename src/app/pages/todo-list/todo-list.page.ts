import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.page.html',
  styleUrls: ['./todo-list.page.scss'],
})
export class TodoListPage implements OnInit {


  ngOnInit() {
  }

  public items: any = [];

  public text:string='';

  constructor(public alertController: AlertController) {}

  public addItem(){
    if(this.text=='') return;
    this.items.push({t:this.text,c:false})
    this.text='';
  }

  public removeItem(index){
    this.items.splice(index,1);
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
