import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { firstValueFrom } from 'rxjs';

import { Joke } from '../model/joke';

@Injectable({
  providedIn: 'root'
})
// Handles all HTTP calls.
export class HttpService {
  private jokeUrl = 'https://api.chucknorris.io/jokes/random';
  private profanityCheckerUrl = 'https://www.purgomalum.com/service/containsprofanity?text=';

  constructor(private http: HttpClient) { }

  // Attempts to fetch a new joke.
  async getJoke() {
    // If joke is obscene, fetch new joke; allow 3 attempts before throwing an error
    for (let count = 0; count < 3; count++) {
      // 'firstValueFrom' resolves the http.get Observable into a Promise, which allows the use of await
      let joke = await firstValueFrom(this.http.get<Joke>(this.jokeUrl));

      // Return joke if it isn't categorized as explicit and doesn't have any profanity
      if (this.checkIfExplicit(joke) || !await this.checkForProfanity(joke.value))
        return joke;
    }

    // Throw an error because an accetable joke couldn't be found within the number of attempts allowed
    throw Error();
  }

  // Checks if given joke has been categorized as explicit.
  private checkIfExplicit(joke: Joke) {
    if (joke.categories instanceof Array<string>)
      return joke.categories.findIndex(c => c === 'explicit') >= 0;

    return false;
  }

  // Checks for profanity in a string, in this case a Chuck Norris joke.
  private checkForProfanity(text: string) {
    // 'firstValueFrom' resolves the http.get Observable into a Promise, which allows the use of await
    return firstValueFrom(this.http.get<boolean>(this.profanityCheckerUrl + text));
  }
}
