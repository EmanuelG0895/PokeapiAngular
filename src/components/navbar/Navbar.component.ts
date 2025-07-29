import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonSearchComponent } from '../searchBar/pokemonSearch.component';
import { SearchService } from '../../app/services/search.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,PokemonSearchComponent],
  templateUrl: './Navbar.component.html',
})
export class NavbarComponent {
  title = 'PokéAPI Angular';
  
  constructor(private searchService: SearchService) {}
  
  onHomeClick(): void {
    console.log('Home clicked');
  }
  
  onAboutClick(): void {
    console.log('About clicked');
  }
  
  onSearch(term: string) {
    this.searchService.updateSearchTerm(term);
  }
}
