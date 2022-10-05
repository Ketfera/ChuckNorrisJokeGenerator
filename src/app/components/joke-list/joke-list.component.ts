import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject } from 'rxjs';

import { StorageService } from '../../services/storage.service';

import { Joke } from 'src/model/joke';

@Component({
  selector: 'app-joke-list',
  templateUrl: './joke-list.component.html',
  styleUrls: ['./joke-list.component.css']
})
export class JokeListComponent implements OnInit {
  protected jokeListColumns = ['value', 'date', 'remove'];

  protected jokeList = new JokeDataSource([]);
  protected length: number = 0;

  constructor(private storageService: StorageService) { }

  ngOnInit(): void {
    // Fetches the saved jokes on startup
    this.setListData(this.storageService.getSavedJokes());
  }

  private setListData(newList: Joke[]) {
    this.length = newList.length;
    this.jokeList.setData(newList);
  }

  // Add a given joke to the list data
  addJoke(joke: Joke): boolean {
    // If the given joke is not present in list already, add it and save the list
    let result = !this.storageService.searchForJoke(joke);
    if (result)
      this.setListData(this.storageService.saveJoke(joke));

    return result;
  }

  protected removeJokeByIndex(index: number) {
    this.setListData(this.storageService.removeJokeByIndex(index));
  }

  protected clearAllJokes() {
    this.setListData(this.storageService.clearAll());
  }
}

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