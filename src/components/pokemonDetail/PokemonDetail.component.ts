import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PokemonService } from '../../app/services/pokemon.service';
import { LoadingComponent } from '../loading/Loading.component';
import { ErrorComponent } from '../error/Error.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent, ErrorComponent],
  templateUrl: './PokemonDetail.component.html',
  styleUrl: './PokemonDetail.component.css'
})
export class PokemonDetailComponent implements OnInit, OnDestroy {
  pokemon: any = null;
  loading = true;
  error: string | null = null;
  private routeSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
      const pokemonId = params['id'];
      if (pokemonId) {
        this.loadPokemonDetails(pokemonId);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  loadPokemonDetails(pokemonId: string): void {
    this.loading = true;
    this.error = null;

    this.pokemonService.getPokemonByName(pokemonId).subscribe({
      next: (pokemon) => {
        if (pokemon) {
          this.pokemon = pokemon;
        } else {
          this.error = 'Pokémon no encontrado';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading Pokémon details:', error);
        this.error = 'Error al cargar los detalles del Pokémon';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getTypeClass(type: string): string {
    const typeClasses: { [key: string]: string } = {
      'normal': 'bg-gray-400',
      'fire': 'bg-red-500',
      'water': 'bg-blue-500',
      'electric': 'bg-yellow-400',
      'grass': 'bg-green-500',
      'ice': 'bg-blue-200',
      'fighting': 'bg-red-700',
      'poison': 'bg-purple-500',
      'ground': 'bg-yellow-600',
      'flying': 'bg-indigo-400',
      'psychic': 'bg-pink-500',
      'bug': 'bg-green-400',
      'rock': 'bg-yellow-700',
      'ghost': 'bg-purple-700',
      'dragon': 'bg-indigo-700',
      'dark': 'bg-gray-700',
      'steel': 'bg-gray-500',
      'fairy': 'bg-pink-300'
    };
    return typeClasses[type.toLowerCase()] || 'bg-gray-400';
  }

  getStatName(statName: string): string {
    const statNames: { [key: string]: string } = {
      'hp': 'PS',
      'attack': 'Ataque',
      'defense': 'Defensa',
      'special-attack': 'Ataque Especial',
      'special-defense': 'Defensa Especial',
      'speed': 'Velocidad'
    };
    return statNames[statName] || statName;
  }

  getStatPercentage(statValue: number): number {
    return (statValue / 255) * 100;
  }

  getPokemonColor(): string {
    if (!this.pokemon?.types?.[0]?.type?.name) {
      return '#ef4444'; // red-500 como fallback
    }
    
    const typeColors: { [key: string]: string } = {
      'normal': '#a3a3a3',
      'fire': '#f97316',
      'water': '#3b82f6',
      'electric': '#eab308',
      'grass': '#22c55e',
      'ice': '#93c5fd',
      'fighting': '#dc2626',
      'poison': '#a855f7',
      'ground': '#ca8a04',
      'flying': '#818cf8',
      'psychic': '#ec4899',
      'bug': '#84cc16',
      'rock': '#a16207',
      'ghost': '#7c3aed',
      'dragon': '#4338ca',
      'dark': '#52525b',
      'steel': '#6b7280',
      'fairy': '#f9a8d4'
    };
    
    return typeColors[this.pokemon.types[0].type.name.toLowerCase()] || '#ef4444';
  }

  getPokemonImage(): string {
    if (!this.pokemon) {
      return '/pokeball.svg';
    }
    
    const officialArtwork = this.pokemon.sprites?.other?.['official-artwork']?.front_default;
    const defaultSprite = this.pokemon.sprites?.front_default;
    
    return officialArtwork || defaultSprite || '/pokeball.svg';
  }

  onRetry(): void {
    if (this.route.snapshot.params['id']) {
      this.loadPokemonDetails(this.route.snapshot.params['id']);
    }
  }
} 