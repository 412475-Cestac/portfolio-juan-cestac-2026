import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PortfolioGroup } from '../../models/media.model';

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './group-card.component.html'
})
export class GroupCardComponent {
  @Input({ required: true }) group!: PortfolioGroup;
  @Input() dark = false;
}
