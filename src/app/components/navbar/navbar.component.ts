import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgFor, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  links = [
    { label: 'inicio', path: '/' },
    { label: 'eventos', path: '/events' },
    { label: 'marcas', path: '/brands' },
    { label: 'shows & night', path: '/shows-night' },
    { label: 'arquitectura e interiores', path: '/architecture-interiors' },
    { label: 'contacto', path: '/contact' }
  ];
}
