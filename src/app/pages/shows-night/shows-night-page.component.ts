import { Component } from '@angular/core';
import { getPortfolioGroupsBySection } from '../../data/photos';
import { GroupCardComponent } from '../../components/group-card/group-card.component';

@Component({
  selector: 'app-shows-night-page',
  standalone: true,
  imports: [GroupCardComponent],
  templateUrl: './shows-night-page.component.html'
})
export class ShowsNightPageComponent {
  groups = getPortfolioGroupsBySection('shows-night');
}
