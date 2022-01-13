import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
const TODOLISTKEY:string='key';
const CURRENT:string='current';
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

  public async setCurrent(data:any){
    await this.todolistStorage.set(CURRENT,data);
  }

  public async getCurrent(){
    return await this.todolistStorage.get(CURRENT)
  }

}
