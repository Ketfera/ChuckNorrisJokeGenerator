import { Injectable } from '@angular/core';
import { Joke } from 'src/app/model/joke';

@Injectable({
  providedIn: 'root'
})
// Manages storage of saved Chuck Norris jokes using LocalStorage.
export class StorageService {
  private jokeList = new Array<Joke>();

  constructor() {
    // Loads list of saved jokes
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
  findJokeIndex(joke: Joke) {
    return this.jokeList.findIndex(j => j.value === joke.value);
  }

  // Adds a given joke to the list of saved jokes and saves it in LocalStorage.
  saveJoke(joke: Joke) {
    joke.dateSaved = new Date();
    // Inserts the given joke at the top of the list of saved jokes
    this.jokeList.unshift(joke);
    localStorage.setItem('cnjg-saved-jokes', JSON.stringify(this.jokeList));
    return this.jokeList;
  }

  // Removes joke from the list of saved jokes at a given index and saves the change in LocalStorage.
  removeJokeByIndex(index: number) {
    this.jokeList.splice(index, 1);
    localStorage.setItem('cnjg-saved-jokes', JSON.stringify(this.jokeList));
    return this.jokeList;
  }

  // Removes all jokes from the list of saved jokes and saves the change in LocalStorage.
  clearAll() {
    this.jokeList.splice(0);
    localStorage.setItem('cnjg-saved-jokes', JSON.stringify(this.jokeList));
    return this.jokeList;
  }
}
