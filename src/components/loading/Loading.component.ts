import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './Loading.component.html',
  styleUrl: './Loading.component.css'
})
export class LoadingComponent {
  @Input() message: string = 'Cargando...';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() fullScreen: boolean = false;

  getSpinnerClasses(): string {
    switch (this.size) {
      case 'small':
        return 'h-6 w-6';
      case 'large':
        return 'h-16 w-16';
      default:
        return 'h-12 w-12';
    }
  }

  getTextClasses(): string {
    switch (this.size) {
      case 'small':
        return 'text-sm text-gray-600';
      case 'large':
        return 'text-lg text-white';
      default:
        return 'text-base text-gray-600';
    }
  }
} 