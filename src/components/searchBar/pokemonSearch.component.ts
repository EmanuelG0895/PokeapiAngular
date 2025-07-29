import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-pokemon-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pokemonSearch.component.html',
})
export class PokemonSearchComponent implements OnDestroy {
  searchTerm: string = '';
  searchHistory: string[] = [];
  showHistory: boolean = false;
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
    this.loadHistory();
    this.setupSearchDebounce();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      const sanitizedTerm = this.sanitizeSearchTerm(term);
      this.search.emit(sanitizedTerm);
    });
  }

  onInputChange() {
    this.showHistory = !!this.searchTerm;
    this.searchSubject.next(this.searchTerm.trim());
  }

  onSearch() {
    const term = this.sanitizeSearchTerm(this.searchTerm.trim().toLowerCase());
    if (!term) return;
    this.addToHistory(term);
    this.search.emit(term);
    this.showHistory = false;
  }

  addToHistory(term: string) {
    const sanitizedTerm = this.sanitizeSearchTerm(term);
    if (!sanitizedTerm) return;

    let history = this.getHistory();
    history = history.filter(item => item !== sanitizedTerm);
    history.unshift(sanitizedTerm);
    if (history.length > 5) history = history.slice(0, 5);
    localStorage.setItem('pokemonSearchHistory', JSON.stringify(history));
    this.searchHistory = history;
  }

  loadHistory() {
    this.searchHistory = this.getHistory().map(term => this.sanitizeSearchTerm(term)).filter(term => term);
  }

  getHistory(): string[] {
    try {
      const history = localStorage.getItem('pokemonSearchHistory');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error loading search history:', error);
      return [];
    }
  }

  selectFromHistory(term: string) {
    const sanitizedTerm = this.sanitizeSearchTerm(term);
    if (sanitizedTerm) {
      this.searchTerm = sanitizedTerm;
      this.onSearch();
    }
  }

  onFocus() {
    this.showHistory = true;
  }

  onBlur() {
    setTimeout(() => this.showHistory = false, 200);
  }

  // Método para sanitizar términos de búsqueda
  private sanitizeSearchTerm(term: string): string {
    if (!term || typeof term !== 'string') {
      return '';
    }
    
    // Remover caracteres peligrosos y limitar longitud
    return term
      .replace(/[<>]/g, '') // Remover < y >
      .replace(/javascript:/gi, '') // Remover javascript:
      .replace(/on\w+=/gi, '') // Remover event handlers
      .replace(/[^\w\s-]/g, '') // Solo permitir letras, números, espacios y guiones
      .substring(0, 30) // Limitar longitud
      .trim();
  }
} 