import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './Error.component.html',
  styleUrl: './Error.component.css'
})
export class ErrorComponent {
  @Input() message: string = 'Ha ocurrido un error';
  @Input() buttonText: string = 'Intentar de nuevo';
  @Input() fullScreen: boolean = false;
  @Output() retry = new EventEmitter<void>();
} 