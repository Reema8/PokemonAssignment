import { Component, OnInit } from '@angular/core';
import { PokemonServiceService } from '../pokemon-services/pokemon-service.service';
import { Router } from '@angular/router';
import { PokemonStorageService } from '../pokemon-services/pokemon-storage.service';
import { ToastConfig, Toaster, ToastType } from "ngx-toast-notifications";
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../user-service/user.service';
UserService
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  searchQueryPokemon = '';
  searchError = '';
  constructor(private pokemonService: PokemonServiceService,
              private storageService: PokemonStorageService,
              private router: Router,
              private toaster: Toaster,
              private spinnerService: NgxSpinnerService,
              private userService: UserService) { }

  ngOnInit() {
  }

  searchPokemon() {
    this.spinnerService.show();
    const reg = /^[a-z]+$/i;
    if (this.searchQueryPokemon.length >= 3 && reg.test(this.searchQueryPokemon)) {
        // use search API to see if pokemon Exists or not
        this.pokemonService.getSinglePokemonDetails(this.searchQueryPokemon.toLowerCase()).subscribe(
          (res: any) => {
          // if pokemon is not found in storage service then only push it into the list otherwise it
          // already present in the list from first page load
          // tslint:disable-next-line: max-line-length
          if (this.storageService.getPokemonArray().findIndex(elem =>   elem.species.name === this.searchQueryPokemon.toLowerCase()) === -1) {
            this.storageService.pokemonArray.push(res);
          }
          this.searchError = '';
          this.router.navigate(['/details', this.searchQueryPokemon.toLowerCase()]); // passing the pokemon name
          this.spinnerService.hide();
          },
          (error) => {
            this.searchError = `Pokemon Not Found by Name ${this.searchQueryPokemon}`;
            this.toaster.open({
              text: this.searchError ,
              type: 'danger',
            });
            this.spinnerService.hide();
          });
    } else {
      this.searchError = 'Atleast 3 alphabets required';
      this.toaster.open({
        text: this.searchError ,
        type: 'danger',
      });
      this.spinnerService.hide();
    }

  }

  navigateTo(path: string) {
    if (path === 'dashboard') {
      this.router.navigate(['/dashboard']);
    }
  }

}
