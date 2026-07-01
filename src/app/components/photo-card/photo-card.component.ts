import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { MediaItem } from '../../models/media.model';

@Component({
  selector: 'app-photo-card',
  standalone: true,
  imports: [NgIf],
  templateUrl: './photo-card.component.html'
})
export class PhotoCardComponent {
  @Input({ required: true }) item!: MediaItem;
  @Input() dark = false;
  @Input() large = false;
  @Input() editorial = false;
  @Input() featured = false;
  @Input() tall = false;
  @Output() itemSelected = new EventEmitter<MediaItem>();
}
