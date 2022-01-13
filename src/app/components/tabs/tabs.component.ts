import { TodolistServiceService } from './../../todolist-service.service';
import { UserService } from './../../services/user.service';
import { ApiService } from './../../services/api.service';
import { Component, Input } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})

export class TabsComponent {

  constructor(
    private api: ApiService,
    private user: UserService,
    private todoStorage: TodolistServiceService,
  ) {
  }

  @Input('share') share: boolean = true;
  @Input('download') download: boolean = true;

  public async social() {
    if (this.share) {
      await this.todoStorage.getCurrent().then((item: any) => {
        console.log(item);
        Share.share({
          title: item.t + (item.c ? ' [COMPLETE]' : ' [TODO]'),
          text: 'Title:' + item.t + "\r\nStatus: " + (item.c ? 'Complete' : 'Incomplete') + "\r\nDescripton: " + item.d + "\r\nCreated: " + item.cr + (item.c ?  "\r\nCompleted:: " + item.co : ''),
          dialogTitle: 'Share this task',
        });
      });
    }
  }

  private async processDownload(items: any) {
    if (items) {
      await Filesystem.writeFile({
        path: 'todolist/items.txt',
        data: JSON.stringify(items),
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
    }
  }

  public async export() {
    const token = await this.user.getToken();
    console.log(token);
    this.api.apicall('auth/getList', {}, token).then((ii: any) => {
      this.processDownload(ii);
    });

  }

}
