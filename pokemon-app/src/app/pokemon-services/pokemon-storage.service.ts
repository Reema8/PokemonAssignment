import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PokemonStorageService {

  public pokemonArray: Array<any> = [];
  constructor() {
    console.log('service is created');
   }

  public setPokemonArray(element: any) {
    this.pokemonArray.push(element);
  }

  public getPokemonArray() {
    return this.pokemonArray;
  }

  public emptyPokemonArray()
  {
    this.pokemonArray.length = 0;
  }
}
