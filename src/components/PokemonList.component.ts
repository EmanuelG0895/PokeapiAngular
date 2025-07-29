import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonCardComponent } from './pokemonCard/PokemonCard.component';
import { PokemonService } from '../app/services/pokemon.service';
import { PokemonSearchComponent } from './searchBar/pokemonSearch.component';
import { SearchService } from '../app/services/search.service';
import { VerMasComponent } from './verMas/VerMas.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, PokemonCardComponent, PokemonSearchComponent, VerMasComponent],
  templateUrl: './PokemonList.component.html',
})
export class PokemonListComponent implements OnInit, OnDestroy {
  loading = true;
  loadingMore = false;
  pokemonList: any[] = [];
  filteredList: any[] = [];
  error: string | null = null;
  currentOffset = 0;
  private searchSubscription: Subscription;

  constructor(
    private pokemonService: PokemonService,
    private searchService: SearchService
  ) {
    this.searchSubscription = this.searchService.searchTerm$.subscribe(term => {
      this.onSearch(term);
    });
  }

  ngOnInit(): void {
    this.loadPokemonList();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  onSearch(term: string) {
    if (!term) {
      // Si no hay término de búsqueda, mostrar todos los Pokémon cargados
      this.filteredList = this.pokemonList;
      this.error = null;
      return;
    }
    
    // Validar el término de búsqueda
    if (!this.isValidSearchTerm(term)) {
      console.warn('Invalid search term:', term);
      return;
    }
    
    // Usar el nuevo método de búsqueda en toda la API
    this.pokemonService.searchPokemonByName(term).subscribe({
      next: (searchResults) => {
        // Validar los resultados antes de mostrarlos
        this.filteredList = this.validatePokemonList(searchResults);
        this.error = null;
      },
      error: (error) => {
        console.error('Error searching Pokémon:', error);
        this.filteredList = [];
        this.error = 'Error al buscar Pokémon. Intenta de nuevo.';
      }
    });
  }

  loadPokemonList(): void {
    console.log('Loading Pokémon list...');
    this.loading = true;
    this.error = null;
    this.currentOffset = 0;

    this.pokemonService.getPokemonListWithDetails(90, 0).subscribe({
      next: (pokemonList) => {
        // Validar la lista antes de asignarla
        this.pokemonList = this.validatePokemonList(pokemonList);
        this.filteredList = this.pokemonList;
        this.loading = false;
        this.currentOffset = 90;
      },
      error: (error) => {
        console.error('Error loading Pokémon:', error);
        this.error = 'Error al cargar los Pokémon. Intenta de nuevo.';
        this.loading = false;
      },
    });
  }

  loadMorePokemon(): void {
    if (this.loadingMore) return;
    
    console.log('Loading more Pokémon...');
    this.loadingMore = true;
    this.error = null;

    this.pokemonService.getPokemonListWithDetails(90, this.currentOffset).subscribe({
      next: (newPokemonList) => {
        // Validar la nueva lista antes de agregarla
        const validatedNewList = this.validatePokemonList(newPokemonList);
        this.pokemonList = [...this.pokemonList, ...validatedNewList];
        this.filteredList = this.pokemonList;
        this.loadingMore = false;
        this.currentOffset += 90;
      },
      error: (error) => {
        console.error('Error loading more Pokémon:', error);
        this.error = 'Error al cargar más Pokémon. Intenta de nuevo.';
        this.loadingMore = false;
      },
    });
  }

  // Método para validar términos de búsqueda
  private isValidSearchTerm(term: string): boolean {
    if (!term || typeof term !== 'string') {
      return false;
    }
    
    // Verificar que no contenga caracteres peligrosos
    const dangerousPatterns = /[<>]|javascript:|on\w+=/gi;
    return !dangerousPatterns.test(term) && term.length <= 30;
  }

  // Método para validar la lista de Pokémon
  private validatePokemonList(pokemonList: any[]): any[] {
    if (!Array.isArray(pokemonList)) {
      return [];
    }
    
    return pokemonList.filter(pokemon => {
      // Validar que el Pokémon tenga las propiedades necesarias
      return pokemon && 
             typeof pokemon === 'object' &&
             typeof pokemon.id === 'number' &&
             typeof pokemon.name === 'string' &&
             pokemon.id > 0 &&
             pokemon.name.length > 0 &&
             pokemon.name.length <= 50;
    });
  }
}
