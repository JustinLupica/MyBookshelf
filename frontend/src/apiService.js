class ApiService {
  constructor() {
    this.baseURL = "http://localhost:3000";
  }

  static fetchUsersBooks(user_id) {
    fetch(`http://localhost:3000/users/${user_id}/books`)
      .then((res) => res.json())
      .then((usersBooks) => {
        console.log(usersBooks)
        UI.displayBooks(usersBooks)});
  }

  static fetchBooks() {
    fetch("http://localhost:3000/books")
      .then((res) => res.json())
      .then((books) => UI.displayBooks(books));
  }

  static createNewBook(book) {
    fetch("http://localhost:3000/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(book),
    })
      .then((res) => res.json())
      .then((book) => UI.addBookToList(book));
  }

  static deleteBook(book_id) {
    const id = parseInt(book_id);
    fetch(`http://localhost:3000/books/${id}`, {
      method: "DELETE",
    });
  }
}
