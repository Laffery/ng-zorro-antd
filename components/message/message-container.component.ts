/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { MessageConfig, onConfigChangeEventForComponent } from 'ng-zorro-antd/core/config';
import { toCssPixel } from 'ng-zorro-antd/core/util';

import { NzMNContainerComponent } from './base';
import { NzMessageComponent } from './message.component';
import { NzMessageData } from './typings';

const NZ_CONFIG_COMPONENT_NAME = 'message';

const NZ_MESSAGE_DEFAULT_CONFIG: Required<MessageConfig> = {
  nzAnimate: true,
  nzDuration: 3000,
  nzMaxStack: 7,
  nzPauseOnHover: true,
  nzTop: 24,
  nzDirection: 'ltr'
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'nz-message-container',
  exportAs: 'nzMessageContainer',
  template: `
    <div class="ant-message" [class.ant-message-rtl]="dir === 'rtl'" [style.top]="top">
      @for (instance of instances; track instance.messageId) {
        <nz-message [instance]="instance" (destroyed)="remove($event.id, $event.userAction)" />
      }
    </div>
  `,
  imports: [NzMessageComponent]
})
export class NzMessageContainerComponent extends NzMNContainerComponent {
  dir: Direction = this.nzConfigService.getConfigForComponent(NZ_CONFIG_COMPONENT_NAME)?.nzDirection || 'ltr';
  top?: string | null;

  constructor() {
    super();
    this.updateConfig();
  }

  override create(message: NzMessageData): Required<NzMessageData> {
    const instance = this.onCreate(message);
    const key = instance.options.nzKey;
    const messageWithSameKey = this.instances.find(msg => msg.options.nzKey === key);

    if (key && messageWithSameKey) {
      this.replaceMessage(messageWithSameKey, instance);
    } else {
      if (this.instances.length >= this.config!.nzMaxStack!) {
        this.instances = this.instances.slice(1);
      }

      this.instances = [...this.instances, instance];
    }

    this.readyInstances();

    return instance;
  }

  protected subscribeConfigChange(): void {
    onConfigChangeEventForComponent(NZ_CONFIG_COMPONENT_NAME, () => {
      this.updateConfig();
      this.dir = this.nzConfigService.getConfigForComponent(NZ_CONFIG_COMPONENT_NAME)?.nzDirection || this.dir;
    });
  }

  protected updateConfig(): void {
    this.config = {
      ...NZ_MESSAGE_DEFAULT_CONFIG,
      ...this.config,
      ...this.nzConfigService.getConfigForComponent(NZ_CONFIG_COMPONENT_NAME)
    };

    this.top = toCssPixel(this.config.nzTop);
    this.cdr.markForCheck();
  }

  private replaceMessage(old: Required<NzMessageData>, _new: Required<NzMessageData>): void {
    const index = this.instances.indexOf(old);
    this.instances = [...this.instances.slice(0, index), _new, ...this.instances.slice(index + 1)];
  }
}
