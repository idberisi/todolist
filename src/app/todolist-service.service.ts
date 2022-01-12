import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
const TODOLISTKEY:string='key';

@Injectable({
  providedIn: 'root'
})
export class TodolistServiceService {
  constructor(
    private todolistStorage : Storage
  ) { }

  public async set(data:any){
    await this.todolistStorage.set(TODOLISTKEY,data);
  }

  public async get(){
    return await this.todolistStorage.get(TODOLISTKEY)
  }
}
