// Importaciones necesarias para el servicio HTTP
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, forkJoin, switchMap, of } from 'rxjs';

// Interfaz para la respuesta de la lista de Pokémon
interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

// Interfaz para los datos completos de un Pokémon
interface PokemonData {
  id: number;
  name: string;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  species: {
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  // URL base de la PokeAPI
  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  // Obtener lista de Pokémon con paginación
  getPokemonList(limit: number = 20, offset: number = 0): Observable<PokemonListResponse> {
    // Validar parámetros de entrada
    const validLimit = this.validateLimit(limit);
    const validOffset = this.validateOffset(offset);
    
    const url = `${this.baseUrl}/pokemon?limit=${validLimit}&offset=${validOffset}`;
    return this.http.get<PokemonListResponse>(url);
  }

  // Obtener datos completos de un Pokémon por URL
  getPokemonByUrl(url: string): Observable<PokemonData> {
    if (!this.isValidUrl(url)) {
      return of(null as any);
    }
    return this.http.get<PokemonData>(url);
  }

  // Obtener datos completos de un Pokémon por nombre
  getPokemonByName(name: string): Observable<PokemonData> {
    const sanitizedName = this.sanitizePokemonName(name);
    if (!sanitizedName) {
      return of(null as any);
    }
    
    const url = `${this.baseUrl}/pokemon/${sanitizedName}`;
    return this.http.get<PokemonData>(url);
  }

  // Obtener lista completa de Pokémon con datos detallados
  getPokemonListWithDetails(limit: number = 20, offset: number = 0): Observable<PokemonData[]> {
    return this.getPokemonList(limit, offset).pipe(
      switchMap(response => {
        // Crear un array de observables para obtener los datos detallados de cada Pokémon
        const pokemonObservables = response.results.map(pokemon => 
          this.getPokemonByUrl(pokemon.url)
        );
        
        // Usar forkJoin para hacer todas las peticiones en paralelo
        return forkJoin(pokemonObservables);
      })
    );
  }

  // Buscar Pokémon por nombre en toda la API
  searchPokemonByName(searchTerm: string): Observable<PokemonData[]> {
    const sanitizedTerm = this.sanitizeSearchTerm(searchTerm);
    if (!sanitizedTerm) {
      return of([]);
    }

    const term = sanitizedTerm.toLowerCase().trim();
    
    // Buscar en una lista amplia de Pokémon para encontrar coincidencias parciales
    return this.getPokemonList(1000, 0).pipe(
      switchMap(response => {
        const matchingPokemon = response.results.filter(pokemon => 
          pokemon.name.toLowerCase().includes(term)
        );
        
        if (matchingPokemon.length === 0) {
          return of([]);
        }
        
        // Limitamos a los primeros 20 resultados para evitar demasiadas peticiones
        const limitedResults = matchingPokemon.slice(0, 20);
        const pokemonObservables = limitedResults.map(pokemon => 
          this.getPokemonByUrl(pokemon.url)
        );
        
        return forkJoin(pokemonObservables);
      })
    );
  }

  // Método para sanitizar términos de búsqueda
  private sanitizeSearchTerm(term: string): string {
    if (!term || typeof term !== 'string') {
      return '';
    }
    
    return term
      .replace(/[<>]/g, '') // Remover < y >
      .replace(/javascript:/gi, '') // Remover javascript:
      .replace(/on\w+=/gi, '') // Remover event handlers
      .replace(/[^\w\s-]/g, '') // Solo permitir letras, números, espacios y guiones
      .substring(0, 30) // Limitar longitud
      .trim();
  }

  // Método para sanitizar nombres de Pokémon
  private sanitizePokemonName(name: string): string {
    if (!name || typeof name !== 'string') {
      return '';
    }
    
    return name
      .replace(/[<>]/g, '') // Remover < y >
      .replace(/javascript:/gi, '') // Remover javascript:
      .replace(/on\w+=/gi, '') // Remover event handlers
      .replace(/[^\w-]/g, '') // Solo permitir letras, números y guiones
      .substring(0, 50) // Limitar longitud
      .trim();
  }

  // Método para validar límites
  private validateLimit(limit: number): number {
    if (typeof limit !== 'number' || limit < 1 || limit > 1000) {
      return 20; // Valor por defecto seguro
    }
    return limit;
  }

  // Método para validar offsets
  private validateOffset(offset: number): number {
    if (typeof offset !== 'number' || offset < 0 || offset > 10000) {
      return 0; // Valor por defecto seguro
    }
    return offset;
  }

  // Método para validar URLs
  private isValidUrl(url: string): boolean {
    if (!url || typeof url !== 'string') {
      return false;
    }
    
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'https:' || urlObj.protocol === 'http:';
    } catch {
      return false;
    }
  }
} 