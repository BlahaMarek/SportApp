import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';

@Injectable({
  providedIn: 'root'
})
export class ConnectivityService {

  constructor(private network: Network) { }
}
