document.addEventListener("DOMContentLoaded", () => {
  const resultsTable = document.getElementById("search-results-table");
  resultsTable.style.visibility = "hidden";
  ApiService.fetchBooks();
});

// UI class: handle dom manipulation tasks
class UI {
  static displayBooks(books) {
    const table = document.querySelector("#book-list")
    table.innerHTML = ""
    for (const book of books) {
      UI.addBookToList(book);
    }
  }

  //Grab the book-list table and loop through all the books returned in the fetch request, and populate the table.
  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td> 
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      `;
    row.id = book.id;

    list.appendChild(row);
  }

  //Delete a book from the DB and remove from DOM.
  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  //Show alert for deleting or adding a book to the DB.
  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    // Disappear in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  //Once the Google Books API fetch request is returned, add the results to the DOM
  static displayResultsToDom(searchResults) {
    console.log(searchResults);
    const viewerURL = "book.html?isbn=";
    const resultsTable = document.querySelector("#search-results-table");
    resultsTable.style.visibility = "visible";
    const list = document.querySelector("#search-results");
    list.innerHTML = "";
    let counter = 1;
    for (const book of searchResults.items) {
      const row = document.createElement("tr");
      row.id = counter;
      row.innerHTML =
        `<td><img src="${book.volumeInfo.imageLinks.thumbnail}"></td>
        <td id="book-title">${book.volumeInfo.title}</td>
        <td id="book-author">${book.volumeInfo.authors}</td>
        <td>${book.volumeInfo.pageCount}</td>
        <td id="book-isbn">${book.volumeInfo.industryIdentifiers[0].identifier}</td>
        <td><a href="${viewerURL}${book.volumeInfo.industryIdentifiers[0].identifier}" class="btn btn-outline-info btn-sm add">Read Book</a></td>
      `;
      list.appendChild(row);
      counter++;
    }
  }
}

//Event: Add a book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  e.preventDefault();
  // Get the form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  //Validations
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    // Instantiate book
    const book = new Book(title, author, isbn, (user_id = 1));

    //Call POST method to persist book to DB
    ApiService.createNewBook(book);
    // Add book to UI
    // UI.addBookToList(book);

    //Show Success Message
    UI.showAlert("Book Added!", "success");

    //Clear fields after Submit
    e.target.reset();
  }
});

// Event: Delete a book
document.querySelector("#book-list").addEventListener("click", (e) => {
  ApiService.deleteBook(e.target.parentElement.parentElement.id);
  UI.deleteBook(e.target);

  //Show delete Message
  UI.showAlert("Book Removed!", "info");
});

// Handle Searching for books using the Google Books API
document.querySelector("#search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("Clicked!");
  const searchData = document.getElementById("search-books").value;
  GoogleBooksApi.fetchSearchResults(searchData);
  e.target.reset();
});

document.querySelector("#userSelect").addEventListener("change", () => {
  const user = document.getElementById("userSelect").value;
  console.log(user)
  ApiService.fetchUsersBooks(user)
})
