import { Component, OnInit } from '@angular/core';
import { PokemonStorageService } from '../pokemon-services/pokemon-storage.service';
import { ActivatedRoute } from '@angular/router';
import { PokemonProfile } from '../models/pokemonProfile';
import { PokemonServiceService } from '../pokemon-services/pokemon-service.service';
import { emitWarning } from 'process';
import { element } from 'protractor';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  pokemonProfile: PokemonProfile;
  constructor(private pokemonStorageService: PokemonStorageService,
              private route: ActivatedRoute,
              private pokemonService: PokemonServiceService,
              private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.route.paramMap.subscribe( // used observable instead of snapshot as search can be used inside the detailscomponent  also
      params => {
        const pokemonName = params.get('name');
        this.getPokemonDetails(pokemonName);
      }
    );
    // this.getPokemonDetails(this.route.snapshot.paramMap.get('name'));
  }

  getPokemonDetails(pokemon: string) {
    this.pokemonProfile = new PokemonProfile();
    // find the pokemon in already stored array dont call the API again.
    const pokIndex = this.pokemonStorageService.getPokemonArray().findIndex(elem =>   elem.species.name === pokemon);
    const myPokemon = this.pokemonStorageService.getPokemonArray()[pokIndex];
    this.pokemonProfile.height = myPokemon.height;
    this.pokemonProfile.weight = myPokemon.weight;
    this.pokemonProfile.id = myPokemon.id;
    this.pokemonProfile.name = pokemon; // or myPokemon.name
    this.pokemonProfile.evolution = [];
    this.pokemonProfile.mainPokemonAvatar = myPokemon.sprites.front_default;
    this.pokemonProfile.hp = myPokemon.stats[0].base_stat;
    this.pokemonProfile.attack = myPokemon.stats[1].base_stat;
    this.pokemonProfile.defense = myPokemon.stats[2].base_stat;
    this.pokemonProfile.specialAttack = myPokemon.stats[3].base_stat;
    this.pokemonProfile.specialDefense = myPokemon.stats[4].base_stat;
    this.pokemonProfile.speed = myPokemon.stats[5].base_stat;
    this.pokemonProfile.types = [];
    myPokemon.types.forEach(element => {
      this.pokemonProfile.types.push(element.type.name);
    });

    const tempArr = [];

    myPokemon.abilities.forEach(element => {
      tempArr.push(element.ability.name);
    });
    this.pokemonProfile.abilities = tempArr.join(',');
    // this is for gender , abilities ,and  others
    this.pokemonService.getDetails(pokemon).subscribe((res: any) => {
      this.pokemonProfile.catchRate = res.capture_rate;
      this.pokemonProfile.hatchSteps = res.hatch_counter;
      this.pokemonProfile.color = res.color.name;
      this.pokemonProfile.evolutionChain = res.evolution_chain.url; //use this URL to get entire evolution chain
      this.pokemonProfile.eggGroups = '';
      res.egg_groups.forEach(element => {
        this.pokemonProfile.eggGroups =  this.pokemonProfile.eggGroups + element.name + ',';
      });
      this.getPokemonEvolutionDetails(this.pokemonProfile.evolutionChain);
      });

    // This call will get evolution details
    // pass id from evolution_chain from profile and not the pokemon id

  }

  searchPokemon(pokemonName: string) {
    this.pokemonService.getSinglePokemonDetails(pokemonName).subscribe((res: any) => {
        this.pokemonProfile.evolvedPokemonAvatar = res.sprites.front_default;
      }
    )
  }

  getPokemonEvolutionDetails(url: string) {
    this.pokemonService.getEvolution(this.pokemonProfile.evolutionChain).subscribe((res: any) => {
      var evoChain = [];
      var evoData = res.chain;
      do {
        var evoDetails = evoData['evolution_details'][0];
        evoChain.push({
          "species_name": evoData.species.name,
          "min_level": !evoDetails ? 1 : evoDetails.min_level,
        });

        evoData = evoData['evolves_to'][0];
      } while (!!evoData && evoData.hasOwnProperty('evolves_to'));
      let currentPokemonIndexInEvoltionChain = evoChain.findIndex(element => element.species_name === this.pokemonProfile.name);
      if (currentPokemonIndexInEvoltionChain !== (evoChain.length - 1)) {
        let nextPokemonIndexInEvolutionChain = currentPokemonIndexInEvoltionChain+1;
        this.pokemonProfile.evolution.push(evoChain[nextPokemonIndexInEvolutionChain]); // This array contains evolution
        this.searchPokemon(evoChain[nextPokemonIndexInEvolutionChain].species_name); // to do handle super form
      }

    });
  }

}
