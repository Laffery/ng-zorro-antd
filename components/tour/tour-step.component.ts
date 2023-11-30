/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NzTourArrow, NzTourPlacement, NzTourStepProps } from 'ng-zorro-antd/tour/tour-options';
import { NzTourService } from 'ng-zorro-antd/tour/tour.service';

@Component({
  selector: 'nz-tour-step',
  exportAs: 'nzTourStepComponent',
  template: ` <div class="ant-tour-content">
    <div class="ant-tour-inner">
      <span nz-icon nzType="close" nzTheme="outline" class="ant-tour-close" (click)="close()"></span>
      <div class="ant-tour-cover"></div>
      <div class="ant-tour-header">
        <div class="ant-tour-title">
          <ng-container *nzStringTemplateOutlet="nzTitle">
            <div [innerHTML]="nzTitle"></div>
          </ng-container>
        </div>
      </div>
      <div class="ant-tour-description">
        <ng-container *nzStringTemplateOutlet="nzDescription">
          <div [innerHTML]="nzDescription"></div>
        </ng-container>
      </div>
      <div class="ant-tour-footer">
        <div *ngIf="total > 1" class="ant-tour-indicators">
          <span *ngFor="let index of sliders" [class.active]="index === current" class="ant-tour-indicator"></span>
        </div>
        <div class="ant-tour-buttons">
          <button nz-button class="ant-tour-prev-btn" *ngIf="current !== 0" nzSize="small" (click)="prevBtnClick()">
            Prev
          </button>
          <button nz-button class="ant-tour-next-btn" nzSize="small" nzType="primary" (click)="nextBtnClick()">
            {{ isLastStep ? 'Finish' : 'Next' }}
          </button>
        </div>
      </div>
    </div>
  </div>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class NzTourStepComponent implements NzTourStepProps, OnInit, OnDestroy {
  @Input() nzArrow?: NzTourArrow;
  @Input() nzTarget?: string | TemplateRef<{}>;
  @Input() nzTitle?: string | TemplateRef<void>;
  @Input() nzDescription?: string | TemplateRef<void>;
  @Input() nzPlacement?: NzTourPlacement;
  @Input() nzMask?: boolean;
  @Input() nzClassName?: string;
  @Input() nzStyle?: object;
  @Input() nzScrollIntoViewOptions?: boolean | ScrollIntoViewOptions;

  @Output() readonly nzClose = new EventEmitter<void>();
  @Output() readonly nzFinish = new EventEmitter<void>();
  @Output() readonly nzPrev = new EventEmitter<void>();
  @Output() readonly nzNext = new EventEmitter<void>();

  total = 0;
  current = 0;

  private destroy$ = new Subject<void>();

  constructor(private nzTourService: NzTourService) {
    this.total = this.nzTourService.total;
    this.current = this.nzTourService.current;
  }

  ngOnInit(): void {
    this.nzTourService.current$.pipe(takeUntil(this.destroy$)).subscribe(current => {
      this.current = current;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get sliders(): number[] {
    return [...Array(this.total).keys()];
  }

  get isLastStep(): boolean {
    return this.current === this.total - 1;
  }

  close(): void {
    this.nzClose.emit();
  }

  prevBtnClick(): void {
    this.nzPrev.emit();
  }

  nextBtnClick(): void {
    if (this.isLastStep) {
      this.nzFinish.emit();
    } else {
      this.nzNext.emit();
    }
  }
}
