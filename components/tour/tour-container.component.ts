/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { NzTourOptions } from 'ng-zorro-antd/tour/tour-options';

@Component({
  selector: 'nz-tour-container',
  exportAs: 'nzTourContainerComponent',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ant-tour'
  }
})
export class NzTourContainerComponent implements NzTourOptions {
  nzSteps = [];
  nzOpen = false;
  nzCurrent = 0;
  nzDefaultCurrent = 0;
  nzMask = true;
  nzAnimated = false;
  nzScrollIntoViewOptions = false;
  nzZIndex = 1001;
}
