import { Component } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'nz-demo-dropdown-dropdown-button',
  imports: [NzButtonModule, NzDropDownModule, NzIconModule],
  template: `
    <nz-button-group>
      <button nz-button (click)="log()">DropDown</button>
      <button nz-button nz-dropdown [nzDropdownMenu]="menu1" nzPlacement="bottomRight">
        <span nz-icon nzType="ellipsis"></span>
      </button>
    </nz-button-group>
    <nz-button-group>
      <button nz-button (click)="log()">DropDown</button>
      <button nz-button nz-dropdown [nzDropdownMenu]="menu2" nzPlacement="bottomRight">
        <span nz-icon nzType="user"></span>
      </button>
    </nz-button-group>
    <nz-button-group>
      <button nz-button disabled>DropDown</button>
      <button nz-button disabled nz-dropdown [nzDropdownMenu]="menu3" nzPlacement="bottomRight">
        <span nz-icon nzType="ellipsis"></span>
      </button>
    </nz-button-group>
    <button nz-button nz-dropdown [nzDropdownMenu]="menu4">
      Button
      <span nz-icon nzType="down"></span>
    </button>
    <nz-dropdown-menu #menu1="nzDropdownMenu">
      <ul nz-menu>
        <li nz-menu-item>menu1 1st menu item</li>
        <li nz-menu-item>menu1 2nd menu item</li>
        <li nz-menu-item>menu1 3rd menu item</li>
      </ul>
    </nz-dropdown-menu>
    <nz-dropdown-menu #menu2="nzDropdownMenu">
      <ul nz-menu>
        <li nz-menu-item>menu2 1st menu item</li>
        <li nz-menu-item>menu2 2nd menu item</li>
        <li nz-menu-item>menu2 3rd menu item</li>
      </ul>
    </nz-dropdown-menu>
    <nz-dropdown-menu #menu3="nzDropdownMenu">
      <ul nz-menu>
        <li nz-menu-item>menu3 1st menu item</li>
        <li nz-menu-item>menu3 2nd menu item</li>
        <li nz-menu-item>menu3 3rd menu item</li>
      </ul>
    </nz-dropdown-menu>
    <nz-dropdown-menu #menu4="nzDropdownMenu">
      <ul nz-menu>
        <li nz-menu-item>menu4 1st menu item</li>
        <li nz-menu-item>menu4 2nd menu item</li>
        <li nz-menu-item>menu4 3rd menu item</li>
      </ul>
    </nz-dropdown-menu>
  `,
  styles: [
    `
      nz-button-group {
        margin: 0 8px 8px 0;
      }
    `
  ]
})
export class NzDemoDropdownDropdownButtonComponent {
  log(): void {
    console.log('click dropdown button');
  }
}
