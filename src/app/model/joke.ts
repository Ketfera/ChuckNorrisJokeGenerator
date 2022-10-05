// Model for Joke JSON object returned from Chuck Norris Joke URL.
export interface Joke {
    categories: string[]; // property present in JSON from URL; used to exclude jokes categorized as "explicit"
    value: string;        // text of joke; property present in JSON from URL
    dateSaved: Date;      // date and time joke is saved to LocalStorage; original property
}