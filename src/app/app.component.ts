import { Component, ViewChild } from '@angular/core';

import { JokeListComponent } from './components/joke-list/joke-list.component';

import { HttpService } from './services/http.service';

import { Joke } from 'src/app/model/joke';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
// Main component for single-page web app.
export class AppComponent {
  title = 'Chuck Norris Joke Generator';

  currentJoke: Joke | null = null;
  errorMessage: string = '';
  isProcessing = false;

  @ViewChild(JokeListComponent)
  private jokeListComponent!: JokeListComponent;

  constructor(private httpService: HttpService) { }

  // Fetches new joke from HTTP service.
  async getNewJoke() {
    this.clearErrorMessage();

    try {
      // Disable buttons while performing HTTP calls
      this.isProcessing = true;

      this.currentJoke = await this.httpService.getJoke();
    } catch(error) {
      this.errorMessage = "An error has occurred; please try again";
    } finally {
      // Re-enable buttons
      this.isProcessing = false;
    }
  }

  // Save current joke to LocalStorage and display it in the joke list.
  saveJoke() {
    this.clearErrorMessage();
    
    // If 'addJoke()' on the JokeListComponent returns false, the joke has already been saved
    if (this.currentJoke !== null && !this.jokeListComponent.addJoke(this.currentJoke))
        this.errorMessage = 'This joke has already been saved';
  }

  // Resets error message.
  private clearErrorMessage() {
    this.errorMessage = '';
  }
}