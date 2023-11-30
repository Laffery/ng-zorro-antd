/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { TemplateRef } from '@angular/core';

export const TOUR_DEFAULT_STEP = 0;
export const TOUR_DEFAULT_Z_INDEX = 1001;

export type NzTourArrow = boolean | { pointAtCenter: boolean };
export type NzTourPlacement =
  | 'left'
  | 'leftTop'
  | 'leftBottom'
  | 'right'
  | 'rightTop'
  | 'rightBottom'
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight';
export type NzScrollIntoViewOptions = boolean | ScrollIntoViewOptions;

export interface NzTourStepInfo {
  nzArrow?: NzTourArrow;
  nzTarget?: string | TemplateRef<{}>;
  nzTitle?: string | TemplateRef<void>;
  nzDescription?: string | TemplateRef<void>;
  nzPlacement?: NzTourPlacement;
  nzMask?: boolean;
  nzClassName?: string;
  nzStyle?: object;
  nzScrollIntoViewOptions?: NzScrollIntoViewOptions;
}

export interface NzTourStepProps extends NzTourStepInfo {
  total?: number;
  current?: number;
  nzOnClose?(): void;
  nzOnFinish?(): void;
  nzOnPrev?(): void;
  nzOnNext?(): void;
  nzRenderPanel?(step: NzTourStepProps, current: number): void;
}

export interface NzTourOptionsOfComponent {
  nzSteps: NzTourStepInfo[];
  nzOpen?: boolean;
  nzCurrent?: number;
  nzDefaultCurrent?: number;
  nzMask?: boolean;
  nzAnimated?: boolean;
  nzArrow?: NzTourArrow;
  nzScrollIntoViewOptions?: NzScrollIntoViewOptions;
  nzZIndex?: number;
}

export interface NzTourOptions extends NzTourOptionsOfComponent {
  nzOnChange?(current: number): void;
  nzOnClose?(current: number): void;
  nzOnFinished?(): void;
  nzOnPopupAlign?(): void;
}
