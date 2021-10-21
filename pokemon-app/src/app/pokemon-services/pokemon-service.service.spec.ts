import { TestBed } from '@angular/core/testing';

import { PokemonServiceService } from './pokemon-service.service';

describe('PokemonServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PokemonServiceService = TestBed.get(PokemonServiceService);
    expect(service).toBeTruthy();
  });
});
