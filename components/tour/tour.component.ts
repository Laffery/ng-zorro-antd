/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';

import { NzTourStepInfo } from 'ng-zorro-antd/tour/tour-options';
import { NzTourService } from 'ng-zorro-antd/tour/tour.service';

@Component({
  selector: 'nz-tour',
  exportAs: 'nzTourComponent',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class NzTourComponent implements OnChanges {
  @Input() nzOpen = false;
  @Input() nzSteps: NzTourStepInfo[] = [];

  constructor(private nzTourService: NzTourService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { nzOpen } = changes;
    if (nzOpen) {
      if (this.nzOpen) {
        this.nzTourService.open({
          nzSteps: this.nzSteps,
          nzMask: true
        });
      }
    }
  }
}
