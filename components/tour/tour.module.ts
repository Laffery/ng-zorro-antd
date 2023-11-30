/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule } from '@angular/cdk/bidi';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NzOutletModule } from 'ng-zorro-antd/core/outlet';
import { NzOverlayModule } from 'ng-zorro-antd/core/overlay';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { NzTourContainerComponent } from './tour-container.component';
import { NzTourStepComponent } from './tour-step.component';
import { NzTourComponent } from './tour.component';
import { NzTourServiceModule } from './tour.service.module';

@NgModule({
  declarations: [NzTourStepComponent, NzTourContainerComponent, NzTourComponent],
  exports: [NzTourStepComponent, NzTourComponent],
  imports: [
    BidiModule,
    CommonModule,
    OverlayModule,
    NzOutletModule,
    NzOverlayModule,
    NzNoAnimationModule,
    NzButtonModule,
    NzIconModule,
    NzTourServiceModule
  ]
})
export class NzTourModule {}
