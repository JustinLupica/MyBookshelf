class GoogleBooksApi {
  constructor() {
    this.baseURL = "https://www.googleapis.com/books/v1/volumes?q=";
  }

  static fetchSearchResults(searchData) {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchData}`)
      .then((res) => res.json())
      .then((searchResults) => UI.displayResultsToDom(searchResults));
  }
}
