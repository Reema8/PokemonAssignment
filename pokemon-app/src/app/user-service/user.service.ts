import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  isAdmin: boolean;
  constructor() {
    this.isAdmin = true;
   }

}
