import { Injectable } from '@angular/core';

import * as config from '../config.json';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public getConfig() {
    return config;
  }

}
