import { Component } from '@angular/core';
import { getPortfolioGroupsBySection } from '../../data/photos';
import { GroupCardComponent } from '../../components/group-card/group-card.component';

@Component({
  selector: 'app-events-page',
  standalone: true,
  imports: [GroupCardComponent],
  templateUrl: './events-page.component.html'
})
export class EventsPageComponent {
  groups = getPortfolioGroupsBySection('events');
}
