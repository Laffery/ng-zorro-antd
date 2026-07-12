/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
  TemplateRef,
  booleanAttribute
} from '@angular/core';

import { CandyDate } from 'ng-zorro-antd/core/time';
import { FunctionProp } from 'ng-zorro-antd/core/types';
import { NzCalendarI18nInterface } from 'ng-zorro-antd/i18n';

import { DateBodyRow, DateCell } from './interface';

@Directive()
export abstract class AbstractTable implements OnInit, OnChanges {
  private _value!: CandyDate;
  private _activeDate: CandyDate = new CandyDate();

  headRow: DateCell[] = [];
  bodyRows: DateBodyRow[] = [];
  MAX_ROW = 6;
  MAX_COL = 7;

  @Input() prefixCls: string = 'ant-picker';
  @Input()
  set value(value: CandyDate | Date) {
    this._value = this.toCandyDate(value);
  }
  get value(): CandyDate {
    return this._value;
  }
  @Input() locale!: NzCalendarI18nInterface;
  @Input()
  set activeDate(value: CandyDate | Date) {
    this._activeDate = this.toCandyDate(value);
  }
  get activeDate(): CandyDate {
    return this._activeDate;
  }
  @Input({ transform: booleanAttribute }) showWeek: boolean = false;
  @Input() selectedValue: CandyDate[] = []; // Range ONLY
  @Input() hoverValue: CandyDate[] = []; // Range ONLY
  @Input() disabledDate?: (d: Date) => boolean;
  @Input() cellRender?: string | TemplateRef<Date> | FunctionProp<TemplateRef<Date> | string>;
  @Input() fullCellRender?: string | TemplateRef<Date> | FunctionProp<TemplateRef<Date> | string>;
  @Input({ transform: booleanAttribute }) canSelectWeek: boolean = false;

  @Output() readonly valueChange = new EventEmitter<CandyDate>();
  @Output() readonly dateValueChange = new EventEmitter<Date>();
  @Output() readonly cellHover = new EventEmitter<CandyDate>(); // Emitted when hover on a day by mouse enter

  protected render(): void {
    if (this.activeDate) {
      this.headRow = this.makeHeadRow();
      this.bodyRows = this.makeBodyRows();
    }
  }

  hasRangeValue(): boolean {
    return this.selectedValue?.length > 0 || this.hoverValue?.length > 0;
  }

  getClassMap(cell: DateCell): Record<string, boolean> {
    return {
      [`ant-picker-cell`]: true,
      [`ant-picker-cell-in-view`]: true,
      [`ant-picker-cell-selected`]: cell.isSelected,
      [`ant-picker-cell-disabled`]: cell.isDisabled,
      [`ant-picker-cell-in-range`]: !!cell.isInSelectedRange,
      [`ant-picker-cell-range-start`]: !!cell.isSelectedStart,
      [`ant-picker-cell-range-end`]: !!cell.isSelectedEnd,
      [`ant-picker-cell-range-start-single`]: !!cell.isStartSingle,
      [`ant-picker-cell-range-end-single`]: !!cell.isEndSingle,
      [`ant-picker-cell-range-hover`]: !!cell.isInHoverRange,
      [`ant-picker-cell-range-hover-start`]: !!cell.isHoverStart,
      [`ant-picker-cell-range-hover-end`]: !!cell.isHoverEnd,
      [`ant-picker-cell-range-hover-edge-start`]: !!cell.isFirstCellInPanel,
      [`ant-picker-cell-range-hover-edge-end`]: !!cell.isLastCellInPanel,
      [`ant-picker-cell-range-start-near-hover`]: !!cell.isRangeStartNearHover,
      [`ant-picker-cell-range-end-near-hover`]: !!cell.isRangeEndNearHover
    };
  }

  abstract makeHeadRow(): DateCell[];
  abstract makeBodyRows(): DateBodyRow[];

  ngOnInit(): void {
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.activeDate && !changes.activeDate.currentValue) {
      this.activeDate = new CandyDate();
    }

    if (
      changes.disabledDate ||
      changes.locale ||
      changes.showWeek ||
      changes.selectWeek ||
      this.isDateRealChange(changes.activeDate) ||
      this.isDateRealChange(changes.value) ||
      this.isDateRealChange(changes.selectedValue) ||
      this.isDateRealChange(changes.hoverValue)
    ) {
      this.render();
    }
  }

  private isDateRealChange(change: SimpleChange): boolean {
    if (change) {
      const previousValue: CandyDate | Date | CandyDate[] = change.previousValue;
      const currentValue: CandyDate | Date | CandyDate[] = change.currentValue;
      if (Array.isArray(currentValue)) {
        return (
          !Array.isArray(previousValue) ||
          currentValue.length !== previousValue.length ||
          currentValue.some((value, index) => {
            const previousCandyDate = previousValue[index];
            return previousCandyDate instanceof CandyDate
              ? previousCandyDate.isSameDay(value)
              : previousCandyDate !== value;
          })
        );
      } else {
        return !this.isSameDate(this.toCandyDate(previousValue as CandyDate | Date), this.toCandyDate(currentValue));
      }
    }
    return false;
  }

  private isSameDate(left: CandyDate | null, right: CandyDate | null): boolean {
    return (!left && !right) || !!(left && right && right.isSameDay(left));
  }

  private toCandyDate(value: CandyDate | Date | null | undefined): CandyDate {
    return value instanceof CandyDate ? value : new CandyDate(value || undefined);
  }
}
