import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Test01Module } from './test01/test01';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Test01Module],
  template: `
    <h1>app.component</h1>
    <app-test01></app-test01>
  `,
})
export class AppComponent {
  title = 'new';
}
