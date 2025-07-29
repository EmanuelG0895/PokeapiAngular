import { Routes } from '@angular/router';
import { PokemonListComponent } from '../components/PokemonList.component';
import { PokemonDetailComponent } from '../components/pokemonDetail/PokemonDetail.component';

export const routes: Routes = [
  { path: '', component: PokemonListComponent },
  { path: 'pokemon/:id', component: PokemonDetailComponent },
  { path: '**', redirectTo: '' }
];
