import { Component } from '@angular/core';

import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'nz-demo-dropdown-trigger',
  imports: [NzDropDownModule, NzIconModule],
  template: `
    <a nz-dropdown nzTrigger="click" [nzDropdownMenu]="menu">
      Click me
      <span nz-icon nzType="down"></span>
    </a>
    <nz-dropdown-menu #menu="nzDropdownMenu">
      <ul nz-menu>
        <li nz-menu-item>1st menu item</li>
        <li nz-menu-item>2nd menu item</li>
        <li nz-menu-divider></li>
        <li nz-menu-item nzDisabled>disabled menu item</li>
        <li nz-submenu nzTitle="sub menu">
          <ul>
            <li nz-menu-item>3rd menu item</li>
            <li nz-menu-item>4th menu item</li>
          </ul>
        </li>
        <li nz-submenu nzDisabled nzTitle="disabled sub menu">
          <ul>
            <li nz-menu-item>3rd menu item</li>
            <li nz-menu-item>4th menu item</li>
          </ul>
        </li>
      </ul>
    </nz-dropdown-menu>
  `
})
export class NzDemoDropdownTriggerComponent {}
