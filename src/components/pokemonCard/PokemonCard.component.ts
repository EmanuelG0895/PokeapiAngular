// Importaciones necesarias para crear un componente Angular
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

// Decorador @Component: Define la configuración del componente
@Component({
  // Selector: Etiqueta HTML personalizada para usar este componente
  selector: 'app-pokemon-card',
  // standalone: true - Indica que es un componente independiente (no necesita NgModule)
  standalone: true,
  // imports: Módulos que este componente necesita para funcionar
  imports: [CommonModule, RouterModule],
  // templateUrl: Archivo HTML que contiene la plantilla del componente
  templateUrl: './PokemonCard.component.html',
})
// Clase del componente: Contiene la lógica y propiedades del componente
export class PokemonCardComponent {
  // @Input permite recibir datos desde el componente padre
  @Input() pokemonData: any = {
    id: 1,
    name: 'pikachu',
    sprites: {
      other: {
        'official-artwork': {
          front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
        }
      }
    },
    species: {
      name: 'pikachu'
    }
  };

  // Constructor para inyectar el Router y DomSanitizer
  constructor(private router: Router, private sanitizer: DomSanitizer) {}

  // Método para navegar al detalle del Pokémon con validación
  navigateToDetail(pokemonName: string): void {
    const sanitizedName = this.sanitizeInput(pokemonName);
    if (sanitizedName) {
      this.router.navigate(['/pokemon', sanitizedName]);
    }
  }

  // Método para obtener la imagen del Pokémon con fallback y sanitización
  getPokemonImage(): SafeUrl {
    const officialArtwork = this.pokemonData?.sprites?.other?.['official-artwork']?.front_default;
    const imageUrl = officialArtwork || '/images/default-pokemon.svg';
    
    // Validar que la URL sea segura
    if (this.isValidImageUrl(imageUrl)) {
      return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    }
    
    return this.sanitizer.bypassSecurityTrustUrl('/images/default-pokemon.svg');
  }

  // Método para obtener el nombre del Pokémon con sanitización
  getPokemonName(): string {
    const name = this.pokemonData?.species?.name || this.pokemonData?.name || 'Unknown';
    return this.sanitizeInput(name);
  }

  // Método para sanitizar entradas de texto
  private sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') {
      return 'Unknown';
    }
    
    // Remover caracteres peligrosos y limitar longitud
    return input
      .replace(/[<>]/g, '') // Remover < y >
      .replace(/javascript:/gi, '') // Remover javascript:
      .replace(/on\w+=/gi, '') // Remover event handlers
      .substring(0, 50); // Limitar longitud
  }

  // Método para validar URLs de imágenes
  private isValidImageUrl(url: string): boolean {
    if (!url || typeof url !== 'string') {
      return false;
    }
    
    // Verificar que sea una URL válida y segura
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'https:' || urlObj.protocol === 'http:';
    } catch {
      return false;
    }
  }

  // Método para validar el ID del Pokémon
  getPokemonId(): number {
    const id = this.pokemonData?.id;
    return this.isValidId(id) ? id : 1;
  }

  // Método para validar ID numérico
  private isValidId(id: any): boolean {
    return typeof id === 'number' && id > 0 && id <= 1000;
  }
} 