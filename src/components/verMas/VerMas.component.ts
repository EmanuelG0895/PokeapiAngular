import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ver-mas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './VerMas.component.html',
})
export class VerMasComponent {
  @Output() loadMore = new EventEmitter<void>();
  
  onLoadMore(): void {
    this.loadMore.emit();
  }
} 