import { Component } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'nz-demo-message-update',
  imports: [NzButtonModule],
  template: `<button nz-button nzType="primary" (click)="createMessage()"> Display a loading indicator </button>`
})
export class NzDemoMessageUpdateComponent {
  constructor(private message: NzMessageService) {}

  createMessage(): void {
    const key = 'updatable';

    this.message.loading('Loading...', {
      nzKey: key,
      nzDuration: 0
    });

    setTimeout(() => {
      this.message.success('Loaded!', {
        nzKey: key,
        nzDuration: 2500
      });
    }, 1000);
  }
}
