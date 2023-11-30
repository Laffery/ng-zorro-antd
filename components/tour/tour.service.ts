/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Overlay, OverlayConfig, OverlayContainer, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { NzConfigService } from 'ng-zorro-antd/core/config';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { getValueWithConfig } from 'ng-zorro-antd/modal';
import { NzTourContainerComponent } from 'ng-zorro-antd/tour/tour-container.component';
import { NzTourOptions, TOUR_DEFAULT_STEP } from 'ng-zorro-antd/tour/tour-options';
import { NzTourServiceModule } from 'ng-zorro-antd/tour/tour.service.module';

@Injectable({
  providedIn: NzTourServiceModule
})
export class NzTourService {
  total = 0;
  current$ = new BehaviorSubject(TOUR_DEFAULT_STEP);

  get current(): number {
    return this.current$.value;
  }

  constructor(
    private nzConfigService: NzConfigService,
    private overlay: Overlay,
    private overlayContainer: OverlayContainer,
    private injector: Injector
  ) {}

  private _open(config: NzTourOptions): NzTourContainerComponent {
    const overlayRef = this.createOverlay(config);
    return this.attachTourContainer(overlayRef);
  }

  private createOverlay(config: NzTourOptions): OverlayRef {
    const globalConfig: NzSafeAny = this.nzConfigService.getConfigForComponent('tour');
    const overlayConfig = new OverlayConfig({
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: this.overlay.position().global()
    });

    if (getValueWithConfig(config?.nzMask, globalConfig?.nzMask, true)) {
      overlayConfig.backdropClass = 'ant-tour-mask';
      const step = config.nzSteps[this.current];
      if (typeof step.nzTarget === 'string') {
        const target = document.querySelector(step.nzTarget) as HTMLElement;
        if (target) {
          this.attachTourMask(target);
        }
      }
    }

    return this.overlay.create(overlayConfig);
  }

  private attachTourContainer(overlayRef: OverlayRef): NzTourContainerComponent {
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        {
          provide: OverlayRef,
          useValue: overlayRef
        }
      ]
    });

    const ContainerComponent = NzTourContainerComponent;
    const containerPortal = new ComponentPortal<NzTourContainerComponent>(ContainerComponent, null, injector);
    const containerRef = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private attachTourMask(origin: HTMLElement): void {
    const mask = new NzTourMask('rgba(0, 0, 0, 0.5)');
    mask.attach(this.overlayContainer, origin);
  }

  open(config: NzTourOptions): void {
    this.current$.next(TOUR_DEFAULT_STEP);
    this._open(config);
    console.log(config);
  }

  close(): void {}

  next(): void {
    this.current$.next(this.current + 1);
  }

  prev(): void {
    this.current$.next(this.current - 1);
  }
}

const MASK_TOP_CLASS = 'nz-tour-mask-top';
const MASK_BOTTOM_CLASS = 'nz-tour-mask-bottom';
const MASK_LEFT_CLASS = 'nz-tour-mask-left';
const MASK_RIGHT_CLASS = 'nz-tour-mask-right';

class NzTourMask {
  private topElement: HTMLElement;
  private bottomElement: HTMLElement;
  private leftElement: HTMLElement;
  private rightElement: HTMLElement;

  constructor(private fill: string) {
    this.topElement = this.createMaskElement(MASK_TOP_CLASS);
    this.bottomElement = this.createMaskElement(MASK_BOTTOM_CLASS);
    this.leftElement = this.createMaskElement(MASK_LEFT_CLASS);
    this.rightElement = this.createMaskElement(MASK_RIGHT_CLASS);
  }

  attach(overlayContainer: OverlayContainer, origin: HTMLElement): void {
    this.setMaskBlockStyleByElement(origin);
    overlayContainer.getContainerElement().appendChild(this.topElement);
    overlayContainer.getContainerElement().appendChild(this.bottomElement);
    overlayContainer.getContainerElement().appendChild(this.leftElement);
    overlayContainer.getContainerElement().appendChild(this.rightElement);
  }

  private setMaskBlockStyleByElement(origin: HTMLElement): void {
    const pos = origin.getBoundingClientRect();
    this.setMaskBlockStyle(this.topElement, ['0', '0', `${pos.right}px`, `${pos.top}px`]);
    this.setMaskBlockStyle(this.bottomElement, [
      `${pos.bottom}px`,
      `${pos.left}px`,
      `calc(100vw - ${pos.left}px)`,
      `calc(100vh - ${pos.bottom}px)`
    ]);
    this.setMaskBlockStyle(this.leftElement, [`${pos.top}px`, '0', `${pos.left}px`, `calc(100vh - ${pos.top}px)`]);
    this.setMaskBlockStyle(this.rightElement, [
      '0',
      `${pos.right}px`,
      `calc(100vw - ${pos.right}px)`,
      `calc(100vh - ${pos.bottom}px)`
    ]);
  }

  private setMaskBlockStyle(
    element: HTMLElement,
    position: [top: string, left: string, width: string, height: string]
  ): void {
    const [top, left, width, height] = position;
    element.style.top = top;
    element.style.left = left;
    element.style.width = width;
    element.style.height = height;
    element.style.position = 'absolute';
    element.style.background = this.fill;
  }

  private createMaskElement(clazz: string): HTMLElement {
    const element = document.createElement('div');
    element.classList.add(clazz);
    return element;
  }
}
