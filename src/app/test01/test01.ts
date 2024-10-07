import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-test01',
  standalone: true,
  imports: [],
  template: '<h2>test01</h2>',
})
export class Test01Component {
  name = 'Test01Component';
}

@NgModule({
  imports: [Test01Component],
  exports: [Test01Component],
})
export class Test01Module {}
