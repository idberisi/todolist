import { UserService } from './../../services/user.service';
import { ApiService } from './../../services/api.service';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';


import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})

export class TabsComponent {

  constructor(
    private api: ApiService,
    private user: UserService,
  ) {
  }

  @Input('download') download: boolean = true;
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
    this.api.apicall('auth/getList', {}, token).then((ii: any) => {
      this.processDownload(ii);
    });
  }

}
