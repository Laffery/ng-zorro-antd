import { Component } from '@angular/core';

import { NzTourStepProps } from 'ng-zorro-antd/tour/tour-options';

@Component({
  selector: 'nz-demo-tour-non-modal',
  template: `
    <button nz-button nzType="primary" (click)="open = true">Begin non-modal Tour</button>

    <nz-divider></nz-divider>

    <nz-space>
      <button nz-button *nzSpaceItem>Upload</button>
      <button nz-button *nzSpaceItem nzType="primary">Save</button>
      <button nz-button *nzSpaceItem>
        <span nz-icon nzType="ellipsis" nzTheme="outline"></span>
      </button>
    </nz-space>
  `
})
export class NzDemoTourNonModalComponent {
  readonly steps: NzTourStepProps[] = [
    {
      nzTitle: 'title',
      nzDescription: 'description',
      nzTarget: '.target-element-selector'
    }
  ];

  open = false;
}
