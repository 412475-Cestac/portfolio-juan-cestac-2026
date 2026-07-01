import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { MediaItem } from '../../models/media.model';

@Component({
  selector: 'app-media-lightbox',
  standalone: true,
  imports: [NgIf],
  templateUrl: './media-lightbox.component.html'
})
export class MediaLightboxComponent {
  @Input({ required: true }) items: MediaItem[] = [];
  @Input({ required: true }) selectedIndex = 0;
  @Output() selectedIndexChange = new EventEmitter<number>();
  @Output() close = new EventEmitter<void>();

  get selectedItem(): MediaItem | undefined {
    return this.items[this.selectedIndex];
  }

  previous(): void {
    const nextIndex = this.selectedIndex === 0 ? this.items.length - 1 : this.selectedIndex - 1;
    this.selectedIndexChange.emit(nextIndex);
  }

  next(): void {
    const nextIndex = this.selectedIndex === this.items.length - 1 ? 0 : this.selectedIndex + 1;
    this.selectedIndexChange.emit(nextIndex);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }

  @HostListener('document:keydown.arrowleft')
  onArrowLeft(): void {
    this.previous();
  }

  @HostListener('document:keydown.arrowright')
  onArrowRight(): void {
    this.next();
  }
}
