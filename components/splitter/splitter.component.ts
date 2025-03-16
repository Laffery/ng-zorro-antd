/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  contentChildren,
  ElementRef,
  input,
  output,
  ViewEncapsulation,
  inject,
  computed,
  linkedSignal,
  signal,
  booleanAttribute
} from '@angular/core';
import { map, merge, Subject, takeUntil } from 'rxjs';
import { pairwise } from 'rxjs/operators';

import { NzDestroyService } from 'ng-zorro-antd/core/services';
import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';
import { getEventWithPoint } from 'ng-zorro-antd/resizable';

import { NzSplitterBarComponent } from './splitter-bar.component';
import { NzSplitterPanelComponent } from './splitter-panel.component';
import { NzSplitterLayout } from './typings';
import { coerceCollapsible, getPercentValue, isPercent } from './utils';

interface PanelSize {
  innerSize: number;
  size: string | number | undefined;
  hasSize: boolean;
  postPxSize: number;
  percentage: number;
  min: string | number | undefined;
  max: string | number | undefined;
  postPercentMinSize: number;
  postPercentMaxSize: number;
}

@Component({
  selector: 'nz-splitter',
  exportAs: 'nzSplitter',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>

    @for (panel of panelProps(); let i = $index; track i; let last = $last) {
      @let size = sizes()[i];
      @let flexBasis = !!size.size ? size.size : 'auto';
      @let flexGrow = !!size.size ? 0 : 1;
      <div class="ant-splitter-panel" [style.flex-basis]="flexBasis" [style.flex-grow]="flexGrow">
        <ng-container *ngTemplateOutlet="panel.contentTemplate"></ng-container>
      </div>

      @if (!last) {
        <div
          nz-splitter-bar
          [ariaNow]="size.percentage * 100"
          [ariaMin]="size.postPercentMinSize * 100"
          [ariaMax]="size.postPercentMaxSize * 100"
          [resizable]="panel.resizable"
          [collapsible]="panel.collapsible"
          [active]="movingIndex() === i"
          [vertical]="nzLayout() === 'vertical'"
          [lazy]="nzLazy()"
          [constrainedOffset]="constrainedOffset()"
          (offsetStart)="startResize(i, $event)"
          (collapse)="collapse(i, $event)"
        ></div>
      }
    }

    <!-- Fake mask for cursor -->
    @if (movingIndex() !== null) {
      <div
        aria-hidden
        class="ant-splitter-mask"
        [class.ant-splitter-mask-horizontal]="nzLayout() === 'horizontal'"
        [class.ant-splitter-mask-vertical]="nzLayout() !== 'horizontal'"
      ></div>
    }
  `,
  imports: [NgTemplateOutlet, NzSplitterBarComponent],
  providers: [NzDestroyService],
  host: {
    class: 'ant-splitter',
    '[class.ant-splitter-horizontal]': 'nzLayout() === "horizontal"',
    '[class.ant-splitter-vertical]': 'nzLayout() !== "horizontal"'
  }
})
export class NzSplitterComponent {
  /** ------------------- Props ------------------- */
  nzLayout = input<NzSplitterLayout>('horizontal');
  nzLazy = input(false, { transform: booleanAttribute });
  readonly nzResizeStart = output<number[]>();
  readonly nzResize = output<number[]>();
  readonly nzResizeEnd = output<number[]>();

  readonly destroy$ = inject(NzDestroyService);
  readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  /** ------------------- Panels ------------------- */
  // Get all panels from content children
  readonly panels = contentChildren(NzSplitterPanelComponent);
  // Subscribe to the change of properties
  readonly panelProps = computed(() =>
    this.panels().map(panel => ({
      defaultSize: panel.nzDefaultSize(),
      size: panel.nzSize(),
      min: panel.nzMin(),
      max: panel.nzMax(),
      resizable: panel.nzResizable(),
      collapsible: coerceCollapsible(panel.nzCollapsible()),
      contentTemplate: panel.contentTemplate()
    }))
  );

  /** ------------------- Sizes ------------------- */
  /**
   * The size of the container, used to calculate the percentage size and flex basis of each panel.
   */
  readonly containerSize = computed(() =>
    this.nzLayout() === 'horizontal'
      ? this.elementRef.nativeElement.clientWidth || 0
      : this.elementRef.nativeElement.clientHeight || 0
  );
  readonly innerSizes = linkedSignal({
    source: this.panelProps,
    computation: source => source.map(panel => panel.defaultSize)
  });
  readonly sizes = computed(() => {
    let emptyCount = 0;
    const containerSize = this.containerSize();
    const innerSizes = this.innerSizes();
    const sizes = this.panelProps().map((panel, index) => {
      const innerSize = innerSizes[index];
      const size = panel.size ?? innerSize;
      const hasSize = panel.size !== undefined;

      // Calculate the percentage size of each panel.
      let percentage: number | undefined;
      if (isPercent(size)) {
        percentage = getPercentValue(size);
      } else if (size || size === 0) {
        const num = Number(size);
        if (!isNaN(num)) {
          percentage = num / containerSize;
        }
      } else {
        percentage = undefined;
        emptyCount++;
      }

      // Calculate the min and max percentage size of each panel.
      const minSize = panel.min;
      const maxSize = panel.max;
      const postPercentMinSize = isPercent(minSize) ? getPercentValue(minSize) : (minSize || 0) / containerSize;
      const postPercentMaxSize = isPercent(maxSize)
        ? getPercentValue(maxSize)
        : (maxSize || containerSize) / containerSize;

      return {
        innerSize,
        size,
        hasSize,
        percentage,
        min: minSize,
        max: maxSize,
        postPercentMinSize,
        postPercentMaxSize
      } as PanelSize;
    });

    const totalPercentage = sizes.reduce((acc, { percentage }) => acc + (percentage ?? 0), 0);

    if (totalPercentage > 1 && !emptyCount) {
      // If total percentage is larger than 1, we will scale it down.
      const scale = 1 / totalPercentage;
      sizes.forEach(size => {
        size.percentage = size.percentage === undefined ? 0 : size.percentage * scale;
      });
    } else {
      // If total percentage is smaller than 1, we will fill the rest.
      const averagePercentage = (1 - totalPercentage) / emptyCount;
      sizes.forEach(size => {
        size.percentage = size.percentage === undefined ? averagePercentage : size.percentage;
      });
    }

    sizes.forEach(size => {
      size.postPxSize = size.percentage * containerSize;
      size.size = containerSize ? coerceCssPixelValue(size.postPxSize) : size.size;
    });

    return sizes;
  });

  /** ------------------ Resize ------------------ */
  /**
   * The index of the panel that is being resized.
   * Mark the moving splitter bar as activated to show the dragging effect
   * even if the mouse is outside the splitter container.
   */
  readonly movingIndex = signal<number | null>(null);
  /**
   * The offset of preview position (lazy mode) when dragging the splitter bar.
   * Constrained by the min and max size of the target panel.
   */
  readonly constrainedOffset = signal<number>(0);
  /**
   * Handle the resize start event for the specified panel.
   * @param index The index of the panel.
   * @param startPos The start position of the resize event.
   */
  startResize(index: number, startPos: [x: number, y: number]): void {
    this.movingIndex.set(index);
    this.nzResizeStart.emit(this.sizes().map(s => s.postPxSize));
    const end$ = new Subject<void>();

    // Updated constraint calculation
    const getConstrainedOffset = (rawOffset: number): number => {
      const { percentage, postPercentMinSize, postPercentMaxSize } = this.sizes()[index];
      const [ariaNow, ariaMin, ariaMax] = [percentage, postPercentMinSize, postPercentMaxSize].map(p => p * 100);

      const containerSize = this.containerSize();
      const currentPos = (containerSize * ariaNow) / 100;
      const newPos = currentPos + rawOffset;

      // Calculate available space
      const minAllowed = Math.max(0, (containerSize * ariaMin) / 100);
      const maxAllowed = Math.min(containerSize, (containerSize * ariaMax) / 100);

      // Constrain new position within bounds
      const clampedPos = Math.max(minAllowed, Math.min(maxAllowed, newPos));
      return clampedPos - currentPos;
    };

    const handleLazyMove = (offset: number): void => {
      this.constrainedOffset.set(getConstrainedOffset(offset));
    };

    const handleLazyEnd = (): void => {
      this.updateOffset(index, this.constrainedOffset());
      this.constrainedOffset.set(0);
    };

    // resizing
    merge(
      fromEventOutsideAngular<MouseEvent>(window, 'mousemove', { passive: true }),
      fromEventOutsideAngular<TouchEvent>(window, 'touchmove', { passive: true })
    )
      .pipe(
        map(event => getEventWithPoint(event)),
        map(({ pageX, pageY }) => (this.nzLayout() === 'horizontal' ? pageX - startPos[0] : pageY - startPos[1])),
        pairwise(),
        takeUntil(merge(end$, this.destroy$))
      )
      .subscribe(([prev, next]) => {
        if (this.nzLazy()) {
          handleLazyMove(next);
        } else {
          const deltaOffset = next - prev;
          // filter out the 0 delta offset
          if (deltaOffset !== 0) {
            this.updateOffset(index, deltaOffset);
          }
        }
      });

    // resize end
    merge(
      fromEventOutsideAngular<MouseEvent>(window, 'mouseup'),
      fromEventOutsideAngular<TouchEvent>(window, 'touchend')
    )
      .pipe(takeUntil(merge(end$, this.destroy$)))
      .subscribe(() => {
        if (this.nzLazy()) {
          handleLazyEnd();
        }
        this.movingIndex.set(null);
        this.nzResize.emit(this.sizes().map(s => s.postPxSize));
        end$.next();
      });
  }

  private updateOffset(index: number, offset: number): void {
    const containerSize = this.containerSize();
    const limitSizes = this.sizes().map(p => [p.min, p.max]);
    const pxSizes = this.sizes().map(p => p.percentage * containerSize);

    const getLimitSize = (size: string | number | undefined, defaultLimit: number): number => {
      if (typeof size === 'string') {
        return getPercentValue(size) * containerSize;
      }
      return size ?? defaultLimit;
    };

    const nextIndex = index + 1;

    // Get boundary
    const startMinSize = getLimitSize(limitSizes[index][0], 0);
    const endMinSize = getLimitSize(limitSizes[nextIndex][0], 0);
    const startMaxSize = getLimitSize(limitSizes[index][1], containerSize);
    const endMaxSize = getLimitSize(limitSizes[nextIndex][1], containerSize);

    let mergedOffset = offset;

    // Align with the boundary
    if (pxSizes[index] + mergedOffset < startMinSize) {
      mergedOffset = startMinSize - pxSizes[index];
    }
    if (pxSizes[nextIndex] - mergedOffset < endMinSize) {
      mergedOffset = pxSizes[nextIndex] - endMinSize;
    }
    if (pxSizes[index] + mergedOffset > startMaxSize) {
      mergedOffset = startMaxSize - pxSizes[index];
    }
    if (pxSizes[nextIndex] - mergedOffset > endMaxSize) {
      mergedOffset = pxSizes[nextIndex] - endMaxSize;
    }

    // Do offset
    pxSizes[index] += mergedOffset;
    pxSizes[nextIndex] -= mergedOffset;
    this.innerSizes.set(pxSizes);
    this.nzResize.emit(pxSizes);
  }

  collapse(index: number, type: 'start' | 'end'): void {
    console.log(index, type);
  }
}
