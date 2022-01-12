import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
const TOKENKEY:string='token';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private storage : Storage
  ) { }

  public async setToken(token:string){
    await this.storage.set(TOKENKEY,token);
  }

  public async getToken(){
    return await this.storage.get(TOKENKEY)
  }

}
