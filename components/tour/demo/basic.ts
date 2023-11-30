import { Component } from '@angular/core';

import { NzTourStepProps } from 'ng-zorro-antd/tour/tour-options';

@Component({
  selector: 'nz-demo-tour-basic',
  template: `
    <button nz-button nzType="primary" (click)="open = true">Begin Tour</button>

    <nz-divider></nz-divider>

    <nz-space>
      <button id="nz-tour-target-1" nz-button *nzSpaceItem>Upload</button>
      <button id="nz-tour-target-2" nz-button *nzSpaceItem nzType="primary">Save</button>
      <button id="nz-tour-target-3" nz-button *nzSpaceItem>
        <span nz-icon nzType="ellipsis" nzTheme="outline"></span>
      </button>
    </nz-space>

    <nz-tour [nzOpen]="open" [nzSteps]="steps">
      <nz-tour-step
        *ngFor="let step of steps"
        [nzTitle]="step.nzTitle"
        [nzDescription]="step.nzDescription"
        [nzTarget]="step.nzTarget"
      ></nz-tour-step>
    </nz-tour>
  `
})
export class NzDemoTourBasicComponent {
  readonly steps: NzTourStepProps[] = [
    {
      nzTitle: 'Upload File',
      nzDescription: 'Put your file here.',
      nzTarget: '#nz-tour-target-1'
    },
    {
      nzTitle: 'Save',
      nzDescription: 'Save your changes.',
      nzTarget: '#nz-tour-target-2'
    },
    {
      nzTitle: 'Other Actions',
      nzDescription: 'Click to see other actions.',
      nzTarget: '#nz-tour-target-3'
    }
  ];

  open = false;
}
