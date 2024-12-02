import { ESCAPE } from '@angular/cdk/keycodes';
import { OverlayContainer, ScrollDispatcher } from '@angular/cdk/overlay';
import { ApplicationRef, Component, Provider, Type, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';

import { createKeyboardEvent, createMouseEvent, dispatchEvent } from 'ng-zorro-antd/core/testing';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { NzContextMenuService } from './context-menu.service';
import { NzDropdownMenuComponent } from './dropdown-menu.component';
import { NzDropDownModule } from './dropdown.module';

describe('context-menu', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  function createComponent<T>(component: Type<T>, providers: Provider[] = []): ComponentFixture<T> {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      providers
    }).compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();

    return TestBed.createComponent<T>(component);
  }

  afterEach(inject([OverlayContainer], (currentOverlayContainer: OverlayContainer) => {
    currentOverlayContainer.ngOnDestroy();
    overlayContainer.ngOnDestroy();
  }));
  it('should create dropdown', fakeAsync(() => {
    const fixture = createComponent(NzTestDropdownContextMenuComponent);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    fixture.detectChanges();
    expect(() => {
      const fakeEvent = createMouseEvent('contextmenu', 300, 300);
      const component = fixture.componentInstance;
      const viewRef = component.nzContextMenuService.create(fakeEvent, component.nzDropdownMenuComponent);
      expect(viewRef).toBeTruthy();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      expect(overlayContainerElement.textContent).toContain('1st menu item');
    }).not.toThrowError();
  }));
  it('should only one dropdown exist', fakeAsync(() => {
    const fixture = createComponent(NzTestDropdownContextMenuComponent);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    fixture.detectChanges();
    expect(() => {
      let fakeEvent = createMouseEvent('contextmenu', 0, 0);
      const component = fixture.componentInstance;
      component.nzContextMenuService.create(fakeEvent, component.nzDropdownMenuComponent);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      expect(overlayContainerElement.textContent).toContain('1st menu item');
      fakeEvent = createMouseEvent('contextmenu', window.innerWidth, window.innerHeight);
      component.nzContextMenuService.create(fakeEvent, component.nzDropdownMenuComponent);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      expect(overlayContainerElement.textContent).toContain('1st menu item');
    }).not.toThrowError();
  }));
  it('should dropdown close when scroll', fakeAsync(() => {
    const scrolledSubject = new Subject<void>();
    const fixture = createComponent(NzTestDropdownContextMenuComponent, [
      { provide: ScrollDispatcher, useFactory: () => ({ scrolled: () => scrolledSubject }) }
    ]);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    expect(() => {
      const fakeEvent = createMouseEvent('contextmenu', 0, 0);
      const component = fixture.componentInstance;
      component.nzContextMenuService.create(fakeEvent, component.nzDropdownMenuComponent);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      expect(overlayContainerElement.textContent).toContain('1st menu item');
      scrolledSubject.next();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      expect(overlayContainerElement.textContent).toBe('');
    }).not.toThrowError();
  }));
  it('should backdrop work with click', fakeAsync(() => {
    const fixture = createComponent(NzTestDropdownContextMenuComponent);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    fixture.detectChanges();
    expect(() => {
      const fakeEvent = createMouseEvent('contextmenu', 300, 300);
      const component = fixture.componentInstance;
      component.nzContextMenuService.create(fakeEvent, component.nzDropdownMenuComponent);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      expect(overlayContainerElement.textContent).toContain('1st menu item');
      document.body.click();
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      expect(overlayContainerElement.textContent).toBe('');
    }).not.toThrowError();
  }));
  it('should backdrop work with keyboard event ESCAPE', fakeAsync(() => {
    const fixture = createComponent(NzTestDropdownContextMenuComponent);
    const keyboardEvent = createKeyboardEvent('keydown', ESCAPE, undefined, 'Escape');
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    fixture.detectChanges();
    expect(() => {
      const fakeEvent = createMouseEvent('contextmenu', 300, 300);
      const component = fixture.componentInstance;
      component.nzContextMenuService.create(fakeEvent, component.nzDropdownMenuComponent);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      expect(overlayContainerElement.textContent).toContain('1st menu item');
      dispatchEvent(document.body, keyboardEvent);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      expect(overlayContainerElement.textContent).toBe('');
    }).not.toThrowError();
  }));
  it('should not run change detection if the overlay is clicked inside', async () => {
    const fixture = createComponent(NzTestDropdownContextMenuComponent);
    fixture.detectChanges();
    const fakeEvent = createMouseEvent('contextmenu', 300, 300);
    const component = fixture.componentInstance;
    component.nzContextMenuService.create(fakeEvent, component.nzDropdownMenuComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const appRef = TestBed.inject(ApplicationRef);
    spyOn(appRef, 'tick');
    overlayContainerElement.querySelector('ul')!.click();
    expect(appRef.tick).toHaveBeenCalledTimes(0);
    document.body.click();
    expect(appRef.tick).toHaveBeenCalledTimes(1);
  });
});

@Component({
  imports: [NzDropDownModule, NzMenuModule],
  template: `
    <nz-dropdown-menu>
      <ul nz-menu>
        <li nz-menu-item>1st menu item</li>
        <li nz-menu-item>2nd menu item</li>
        <li nz-menu-item>3rd menu item</li>
      </ul>
    </nz-dropdown-menu>
  `
})
export class NzTestDropdownContextMenuComponent {
  @ViewChild(NzDropdownMenuComponent, { static: true }) nzDropdownMenuComponent!: NzDropdownMenuComponent;

  constructor(public nzContextMenuService: NzContextMenuService) {}
}
