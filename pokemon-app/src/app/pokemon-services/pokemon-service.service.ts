import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PokemonServiceService {

  constructor(
    private http: HttpClient
  ) { }

  getCatchThemAll(url?: string) {
    if (url) {
      return this.http.get(url);
    } else {
      return this.http.get('http://pokeapi.co/api/v2/pokemon/?limit=30 &offset=0'); // the initial API we will hit
    }

  }

  getPokePic(url) {
    return this.http.get(url);
  }

  // for detail page
  getDetails(name: string) {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon-species/${name}/`);
  }

  getEvolution(myUrl: string) {
    return this.http.get(myUrl);
  }

  // use this API is search and finding evolved pokemon pic
  getSinglePokemonDetails(pokemonName: string){
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
  }
}
