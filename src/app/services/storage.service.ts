import { Injectable } from '@angular/core';
import { Joke } from 'src/model/joke';

@Injectable({
  providedIn: 'root'
})
// Manages storage of saved Chuck Norris jokes using LocalStorage.
export class StorageService {
  private jokeList = new Array<Joke>();

  constructor() {
    // Loads list of saved jokes on startup
    let jsonString = localStorage.getItem('cnjg-saved-jokes');
    if (jsonString !== null) {
      try {
        let jsonObject = JSON.parse(jsonString);
        if (jsonObject instanceof Array<Joke>)
          this.jokeList = jsonObject;
      } catch { }
    }
  }

  // Returns the list of saved jokes.
  getSavedJokes() {
    return this.jokeList;
  }

  // Returns 'true' if a given joke has already been added.
  searchForJoke(joke: Joke) {
    return this.jokeList.findIndex(j => j.value === joke.value) >= 0;
  }

  // Saves a given joke to the list of saved jokes and stores it in LocalStorage.
  saveJoke(joke: Joke) {
    joke.dateSaved = new Date();
    // Inserts the given joke at the top of the list of saved jokes
    this.jokeList.unshift(joke);
    localStorage.setItem('cnjg-saved-jokes', JSON.stringify(this.jokeList));
    return this.jokeList;
  }

  removeJokeByIndex(index: number) {
    this.jokeList.splice(index, 1);
    localStorage.setItem('cnjg-saved-jokes', JSON.stringify(this.jokeList));
    return this.jokeList;
  }

  clearAll() {
    this.jokeList.splice(0);
    localStorage.setItem('cnjg-saved-jokes', JSON.stringify(this.jokeList));
    return this.jokeList;
  }
}
