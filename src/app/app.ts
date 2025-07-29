import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PokemonListComponent } from '../components/PokemonList.component';
import { NavbarComponent } from '../components/navbar/Navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, PokemonListComponent, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('pokeapi');
}
