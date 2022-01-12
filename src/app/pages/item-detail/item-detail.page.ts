import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NewserviceService,todoItem } from 'src/app/newservice.service';



@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
})
export class ItemDetailPage implements OnInit {

  public item:todoItem;
  public index:any;

  constructor(private router:Router,private alertController:AlertController,private activatedRoute:ActivatedRoute, private newService:NewserviceService) { }

  ngOnInit() {
    this.index=this.activatedRoute.snapshot.paramMap.get('index');
    this.item=this.newService.getDetail(this.index);
  }

  public async updateItem(){
    this.newService.updateItem(this.item,this.index);
    this.router.navigate(['/'])
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
            this.removeItem();
          }
        }
      ]
    });
    await alert.present();
  }

  public removeItem(){
    this.newService.removeItem(this.index);
    this.router.navigate(['/'])
  }
}

