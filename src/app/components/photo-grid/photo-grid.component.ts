import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MediaItem } from '../../models/media.model';
import { PhotoCardComponent } from '../photo-card/photo-card.component';

@Component({
  selector: 'app-photo-grid',
  standalone: true,
  imports: [PhotoCardComponent],
  templateUrl: './photo-grid.component.html'
})
export class PhotoGridComponent {
  @Input({ required: true }) items: MediaItem[] = [];
  @Input() dark = false;
  @Input() large = false;
  @Input() editorial = false;
  @Output() itemSelected = new EventEmitter<number>();
}
