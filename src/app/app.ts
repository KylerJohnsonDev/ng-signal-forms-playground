import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header>
      <nav>
        <a routerLink="/reactive" routerLinkActive="active">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M3 9h18"/>
          </svg>
          <span>Reactive Form</span>
        </a>
        <a routerLink="/signal" routerLinkActive="active">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
          <span>Signal Form</span>
        </a>
      </nav>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    
    header {
      background: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      padding: 0.75rem 2rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }
    
    nav { 
      display: flex; 
      justify-content: center; 
      gap: 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    nav a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #6b7280;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.875rem;
      background: transparent;
      border: 1px solid transparent;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    
    nav a::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
      transition: left 0.5s;
    }
    
    nav a:hover {
      color: #4f46e5;
      background: #f3f4f6;
      border-color: #e5e7eb;
      transform: translateY(-1px);
    }
    
    nav a:hover::before {
      left: 100%;
    }
    
    nav a.active {
      color: #4f46e5;
      background: #eef2ff;
      border-color: #c7d2fe;
      font-weight: 600;
    }
    
    nav a svg {
      width: 18px;
      height: 18px;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    nav a:hover svg {
      transform: scale(1.1) rotate(5deg);
    }
    
    main { 
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    @media (max-width: 640px) {
      header {
        padding: 0.75rem 1rem;
      }
      
      nav {
        flex-direction: column;
        gap: 0.5rem;
      }
      
      nav a {
        justify-content: center;
      }
      
      main {
        padding: 1.5rem;
      }
    }
  `]
})
export class App {
  protected readonly title = signal('ng-signal-forms-playground');
}
