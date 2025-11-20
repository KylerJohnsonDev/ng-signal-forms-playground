import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header>
      <h1>{{ title() }}</h1>
      <nav>
        <a routerLink="/reactive" routerLinkActive="active">Reactive Form</a>
        <a routerLink="/signal" routerLinkActive="active">Signal Form</a>
      </nav>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    header {
      background: #333;
      color: white;
      padding: 1rem;
      text-align: center;
    }
    h1 { margin: 0 0 1rem 0; font-size: 1.5rem; }
    nav { display: flex; justify-content: center; gap: 1rem; }
    nav a {
      color: #aaa;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: color 0.3s, background 0.3s;
    }
    nav a:hover { color: white; background: rgba(255,255,255,0.1); }
    nav a.active { color: white; background: rgba(255,255,255,0.2); font-weight: bold; }
    main { padding: 2rem; }
  `]
})
export class App {
  protected readonly title = signal('ng-signal-forms-playground');
}
