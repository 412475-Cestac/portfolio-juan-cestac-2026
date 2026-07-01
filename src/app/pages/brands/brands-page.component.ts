import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { getPortfolioGroupsBySection } from '../../data/photos';
import { GroupCardComponent } from '../../components/group-card/group-card.component';

@Component({
  selector: 'app-brands-page',
  standalone: true,
  imports: [NgFor, GroupCardComponent],
  templateUrl: './brands-page.component.html'
})
export class BrandsPageComponent {
  groups = getPortfolioGroupsBySection('brands');
}
