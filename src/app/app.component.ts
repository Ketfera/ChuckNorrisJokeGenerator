import { Component, ViewChild } from '@angular/core';

import { JokeListComponent } from './components/joke-list/joke-list.component';

import { HttpService } from './services/http.service';

import { Joke } from 'src/model/joke';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Chuck Norris Joke Generator';

  currentJoke: Joke | null = null;
  errorMessage: string | null = null;
  isProcessing = false;

  @ViewChild(JokeListComponent)
  private jokeListComponent!: JokeListComponent;

  constructor(private httpService: HttpService) { }

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

  saveJoke() {
    this.clearErrorMessage();
    
    if (this.currentJoke !== null && !this.jokeListComponent.addJoke(this.currentJoke))
        this.errorMessage = 'This joke has already been added';
  }

  clearErrorMessage() {
    this.errorMessage = '';
  }
}