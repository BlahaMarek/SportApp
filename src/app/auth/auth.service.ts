import { Injectable } from '@angular/core';
import * as firebase from "firebase";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userId: string;
  constructor() {

  }

  get userIdAuth(): string {
    return this.userId;
  }
}
