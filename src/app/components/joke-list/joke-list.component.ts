import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject } from 'rxjs';

import { StorageService } from '../../services/storage.service';

import { Joke } from 'src/app/model/joke';

@Component({
  selector: 'app-joke-list',
  templateUrl: './joke-list.component.html',
  styleUrls: ['./joke-list.component.css']
})
// Component for displaying and managing saved jokes.
export class JokeListComponent implements OnInit {
  protected jokeListColumns = ['value', 'date', 'remove'];

  protected jokeList = new JokeDataSource([]);
  protected length: number = 0; // If 0, the entire component is not displayed

  constructor(private storageService: StorageService) { }

  ngOnInit(): void {
    // Fetches the saved jokes on startup
    this.setListData(this.storageService.getSavedJokes());
  }

  // Updates the joke list in the DataSource.
  private setListData(newList: Joke[]) {
    // Records length of new joke list, since access to the length
    // isn't available after the list is set to the DataSource
    this.length = newList.length;
    this.jokeList.setData(newList);
  }

  // Adds a given joke to the joke list.
  addJoke(joke: Joke): boolean {
    // If the given joke is not present in list already, add it and save the list
    let result = this.storageService.findJokeIndex(joke) === -1;
    if (result)
      this.setListData(this.storageService.saveJoke(joke));

    return result;
  }

  // Removes joke from the joke list at a given index.
  protected removeJokeByIndex(index: number) {
    this.setListData(this.storageService.removeJokeByIndex(index));
  }

  // Clears all jokes from the joke list.
  protected clearAllJokes() {
    this.setListData(this.storageService.clearAll());
  }
}

// The DataSource object that provides datastream to the table element.
class JokeDataSource extends DataSource<Joke> {
  private _dataStream = new ReplaySubject<Joke[]>();

  constructor(initialData: Joke[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<Joke[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: Joke[]) {
    this._dataStream.next(data);
  }
}