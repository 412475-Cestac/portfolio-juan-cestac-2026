import { Component, HostListener } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [NgIf],
  templateUrl: './scroll-to-top.component.html'
})
export class ScrollToTopComponent {
  isVisible = false;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isVisible = window.scrollY > 300;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
