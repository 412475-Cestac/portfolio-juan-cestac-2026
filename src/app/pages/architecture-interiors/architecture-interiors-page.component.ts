import { Component } from '@angular/core';
import { getPortfolioGroupsBySection } from '../../data/photos';
import { GroupCardComponent } from '../../components/group-card/group-card.component';

@Component({
  selector: 'app-architecture-interiors-page',
  standalone: true,
  imports: [GroupCardComponent],
  templateUrl: './architecture-interiors-page.component.html'
})
export class ArchitectureInteriorsPageComponent {
  groups = getPortfolioGroupsBySection('architecture-interiors');
}
