import { Component } from '@angular/core';

import { NzCollapseModule } from 'ng-zorro-antd/collapse';

@Component({
  selector: 'nz-demo-collapse-custom',
  standalone: true,
  imports: [NzCollapseModule],
  template: `
    <nz-collapse [nzBordered]="false">
      @for (panel of panels; track panel) {
        <nz-collapse-panel
          #p
          [nzHeader]="panel.name"
          [nzActive]="panel.active"
          [ngStyle]="panel.customStyle"
          [nzExpandedIcon]="!$first ? panel.icon || expandedIcon : undefined"
        >
          <p>{{ panel.name }} content</p>
          <ng-template #expandedIcon let-active>
            {{ active }}
            <span nz-icon nzType="caret-right" class="ant-collapse-arrow" [nzRotate]="p.nzActive ? 90 : -90"></span>
          </ng-template>
        </nz-collapse-panel>
      }
    </nz-collapse>
  `
})
export class NzDemoCollapseCustomComponent {
  panels = [
    {
      active: true,
      disabled: false,
      name: 'This is panel header 1',
      customStyle: {
        background: '#f7f7f7',
        'border-radius': '4px',
        'margin-bottom': '24px',
        border: '0px'
      }
    },
    {
      active: false,
      disabled: true,
      name: 'This is panel header 2',
      icon: 'double-right',
      customStyle: {
        background: '#f7f7f7',
        'border-radius': '4px',
        'margin-bottom': '24px',
        border: '0px'
      }
    },
    {
      active: false,
      disabled: false,
      name: 'This is panel header 3',
      customStyle: {
        background: '#f7f7f7',
        'border-radius': '4px',
        'margin-bottom': '24px',
        border: '0px'
      }
    }
  ];
}
