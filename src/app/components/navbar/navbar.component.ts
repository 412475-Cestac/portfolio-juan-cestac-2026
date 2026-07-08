import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  links = [
    { label: 'Home', path: '/' },
    { label: 'Events', path: '/events' },
    { label: 'Brands', path: '/brands' },
    { label: 'Shows & Night', path: '/shows-night' },
    { label: 'Architecture & Interiors', path: '/architecture-interiors' },
    { label: 'Contact', path: '/contact' }
  ];
}
