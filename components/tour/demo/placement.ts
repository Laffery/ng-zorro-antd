import { Component } from '@angular/core';

import { NzTourStepProps } from 'ng-zorro-antd/tour/tour-options';

@Component({
  selector: 'nz-demo-tour-placement',
  template: `<button nz-button nzType="primary" (click)="open = true">Begin Tour</button>`
})
export class NzDemoTourPlacementComponent {
  readonly steps: NzTourStepProps[] = [
    {
      nzTitle: 'title',
      nzDescription: 'description',
      nzTarget: '.target-element-selector'
    }
  ];

  open = false;
}
