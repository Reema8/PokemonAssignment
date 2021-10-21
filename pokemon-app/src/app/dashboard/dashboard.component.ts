import { Component, OnInit } from '@angular/core';
import { PokemonServiceService } from '../pokemon-services/pokemon-service.service';
import { MasterAPIData } from '../models/masteAPIData';
import { Url } from 'url';
import { Router } from '@angular/router';
import { PokemonStorageService } from '../pokemon-services/pokemon-storage.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  pokemonList = [];
  secondPokemonList = [];
  apiData: MasterAPIData; // this will contain result ,urls for next and previous 30 pokemons
  constructor(
    private pokemonService: PokemonServiceService,
    private router: Router,
    private pokemonStorageService: PokemonStorageService,
    private spinnerService: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.callPokemonService();
  }
  callPokemonService(url?: string) {
    this.spinnerService.show();
    this.pokemonList = [];
    this.secondPokemonList = [];
    this.apiData = new MasterAPIData();
    // empty the storage service array to reflect new 30 pokemon
    this.pokemonStorageService.emptyPokemonArray();
    this.pokemonService.getCatchThemAll(url).subscribe((data: MasterAPIData) => {
      this.apiData.next = data.next;
      this.apiData.previous = data.previous;
      this.pokemonList =  data.results; // this list contains only pokemon name and url
      this.pokemonList.forEach((pokemon) => {
        this.pokemonService.getPokePic(pokemon.url).subscribe((res) => {// pass url for each pokemon
          this.secondPokemonList.push(res); // this list contains abilities , jpegs, fights etc.
          this.pokemonStorageService.setPokemonArray(res); // setting the same array to service if we need to reuse it.
          this.spinnerService.hide();
        });
      });
    },
    (error) => {
      console.log(error);
    });
  }
  next() {
    if (this.apiData && this.apiData.next !== null) {
      this.callPokemonService(this.apiData.next);
    } else{
      // show pop up something went wrong
    }
  }

  previous() {
    if (this.apiData && this.apiData.previous !== null) {
      this.callPokemonService(this.apiData.previous);
    } else{
      // show pop up something went wrong
    }
  }


  showDetails(name: string)
  {
    //event.preventDefault();
    this.router.navigate(['/details', name]);
  }
}
