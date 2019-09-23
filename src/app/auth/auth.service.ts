import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userId: string = 'xxx';
  constructor() { }

  get userIdAuth(): string {
    return this.userId;
  }
}
