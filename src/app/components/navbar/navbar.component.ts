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
    { label: 'Inicio', path: '/' },
    { label: 'Eventos', path: '/events' },
    { label: 'Marcas', path: '/brands' },
    { label: 'Shows & Night', path: '/shows-night' },
    { label: 'Arquitectura e Interiores', path: '/architecture-interiors' },
    { label: 'Contacto', path: '/contact' }
  ];
}
