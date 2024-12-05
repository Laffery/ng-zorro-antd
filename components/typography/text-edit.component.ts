/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ENTER, ESCAPE } from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
  afterNextRender,
  inject
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { first, switchMap, takeUntil } from 'rxjs/operators';

import { NzOutletModule } from 'ng-zorro-antd/core/outlet';
import { NzDestroyService } from 'ng-zorro-antd/core/services';
import { NzTransButtonModule } from 'ng-zorro-antd/core/trans-button';
import { NzTSType } from 'ng-zorro-antd/core/types';
import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';
import { NzI18nService, NzTextI18nInterface } from 'ng-zorro-antd/i18n';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAutosizeDirective, NzInputModule } from 'ng-zorro-antd/input';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'nz-text-edit',
  exportAs: 'nzTextEdit',
  template: `
    @if (editing) {
      <textarea #textarea nz-input nzAutosize (blur)="confirm()"></textarea>
      <button nz-trans-button class="ant-typography-edit-content-confirm" (click)="confirm()">
        <span nz-icon nzType="enter"></span>
      </button>
    } @else {
      <button
        nz-tooltip
        nz-trans-button
        class="ant-typography-edit"
        [nzTooltipTitle]="tooltip === null ? null : tooltip || locale?.edit"
        (click)="onClick()"
      >
        <ng-container *nzStringTemplateOutlet="icon; let icon">
          <span nz-icon [nzType]="icon"></span>
        </ng-container>
      </button>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  providers: [NzDestroyService],
  imports: [NzInputModule, NzTransButtonModule, NzIconModule, NzToolTipModule, NzOutletModule]
})
export class NzTextEditComponent implements OnInit {
  editing = false;
  locale!: NzTextI18nInterface;

  @Input() text?: string;
  @Input() icon: NzTSType = 'edit';
  @Input() tooltip?: null | NzTSType;
  @Output() readonly startEditing = new EventEmitter<void>();
  @Output() readonly endEditing = new EventEmitter<string>(true);
  @ViewChild('textarea', { static: false })
  set textarea(textarea: ElementRef<HTMLTextAreaElement> | undefined) {
    this.textarea$.next(textarea);
  }
  @ViewChild(NzAutosizeDirective, { static: false }) autosizeDirective!: NzAutosizeDirective;

  beforeText?: string;
  currentText?: string;
  nativeElement = this.host.nativeElement;

  // We could've saved the textarea within some private property (e.g. `_textarea`) and have a getter,
  // but having subject makes the code more reactive and cancellable (e.g. event listeners will be
  // automatically removed and re-added through the `switchMap` below).
  private textarea$ = new BehaviorSubject<ElementRef<HTMLTextAreaElement> | null | undefined>(null);

  private injector = inject(Injector);

  constructor(
    private ngZone: NgZone,
    private host: ElementRef<HTMLElement>,
    private cdr: ChangeDetectorRef,
    private i18n: NzI18nService,
    private destroy$: NzDestroyService
  ) {}

  ngOnInit(): void {
    this.i18n.localeChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.locale = this.i18n.getLocaleData('Text');
      this.cdr.markForCheck();
    });

    this.textarea$
      .pipe(
        switchMap(textarea => fromEventOutsideAngular<KeyboardEvent>(textarea?.nativeElement, 'keydown')),
        takeUntil(this.destroy$)
      )
      .subscribe(event => {
        // Caretaker note: adding modifier at the end (for instance `(keydown.esc)`) will tell Angular to add
        // an event listener through the `KeyEventsPlugin`, which always runs `ngZone.runGuarded()` internally.
        // We're interested only in escape and enter keyboard buttons, otherwise Angular will run change detection
        // on any `keydown` event.
        if (event.keyCode !== ESCAPE && event.keyCode !== ENTER) {
          return;
        }

        this.ngZone.run(() => {
          if (event.keyCode === ESCAPE) {
            this.onCancel();
          } else {
            this.onEnter(event);
          }
          this.cdr.markForCheck();
        });
      });

    this.textarea$
      .pipe(
        switchMap(textarea => fromEventOutsideAngular<KeyboardEvent>(textarea?.nativeElement, 'input')),
        takeUntil(this.destroy$)
      )
      .subscribe(event => {
        this.currentText = (event.target as HTMLTextAreaElement).value;
      });
  }

  onClick(): void {
    this.beforeText = this.text;
    this.currentText = this.beforeText;
    this.editing = true;
    this.startEditing.emit();
    this.focusAndSetValue();
  }

  confirm(): void {
    this.editing = false;
    this.endEditing.emit(this.currentText);
  }

  onEnter(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.confirm();
  }

  onCancel(): void {
    this.currentText = this.beforeText;
    this.confirm();
  }

  focusAndSetValue(): void {
    const { injector } = this;

    afterNextRender(
      () => {
        this.textarea$
          .pipe(
            // It may still not be available, so we need to wait until view queries
            // are executed during the change detection. It's safer to wait until
            // the query runs and the textarea is set on the behavior subject.
            first((textarea): textarea is ElementRef<HTMLTextAreaElement> => textarea != null),
            takeUntil(this.destroy$)
          )
          .subscribe(textarea => {
            textarea.nativeElement.focus();
            textarea.nativeElement.value = this.currentText || '';
            this.autosizeDirective.resizeToFitContent();
            this.cdr.markForCheck();
          });
      },
      { injector }
    );
  }
}
