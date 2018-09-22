import React, { Component } from "react";
import * as BooksAPI from "./BooksAPI";
import "./App.css";

/*
========== This is for a selection menu ===========
*/
class Select extends Component {
  state = {
    bookName: this.props.bookName, // name of the book
    bookId: this.props.bookId // unique id for each book
  };

  render() {
    return (
      <select
        onChange={e =>
          this.props.onBookChange(
            e.target.value,
            this.state.bookName,
            this.state.bookId
          )
        }
        value={this.props.shelf}
      >
        <option value="move" disabled>
          Move to...
        </option>
        <option value="currentlyReading">Currently Reading</option>
        <option value="wantToRead">Want to Read</option>
        <option value="read">Read</option>
        <option value="none">None</option>
      </select>
    );
  }
}

/*
========== This is for an individual book item ===========
*/
class Book extends Component {
  render() {
    return (
      <li>
        <div className="book">
          <div className="book-top">
            <div
              className="book-cover"
              style={{
                width: 128,
                height: 193,
                backgroundImage: `url(${this.props.image})`
              }}
            />
            <div className="book-shelf-changer">
              <Select
                currentValue={this.props.shelf}
                onBookChange={this.props.onBookChange}
                bookName={this.props.title}
                bookId={this.props.bookId}
                shelf={this.props.shelf}
              />
            </div>
          </div>
          <div className="book-title">{this.props.title}</div>
          <div className="book-authors">{this.props.author}</div>
        </div>
      </li>
    );
  }
}

/*
========== This is for an individual bookshelf ===========
*/
class BookShelf extends Component {
  // state = {
  //   books: this.props.booksInThisShelf,
  //   bookShelf: this.props.shelfTitle
  // };

  render() {
    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{this.props.shelfTitle}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {this.props.booksInThisShelf.map(book => (
              <Book
                title={book.title}
                author={book.authors}
                image={book.imageLinks.thumbnail}
                shelf={book.shelf}
                key={book.id}
                bookId={book.id}
                onBookChange={this.props.onBookChange}
              />
            ))}
          </ol>
        </div>
      </div>
    );
  }
}

/*
========== Main Page for the Book Listings ===========
*/
class BooksPage extends Component {
  // Anytime state changes, the UI will update automatically
  state = {
    boxOfBooks: [],
    booksCurrentlyReading: [],
    booksWantToRead: [],
    booksAlreadyRead: []
  };

  // Get a list of all the books here with AJAX request
  componentDidMount() {
    // this will run right after the component is added to the DOM
    BooksAPI.getAll().then(books => {
      this.setState({ boxOfBooks: books });
      this.setState({
        booksCurrentlyReading: this.state.boxOfBooks.filter(
          book => book.shelf === "currentlyReading"
        ),
        booksWantToRead: this.state.boxOfBooks.filter(
          book => book.shelf === "wantToRead"
        ),
        booksAlreadyRead: this.state.boxOfBooks.filter(
          book => book.shelf === "read"
        )
      });
    });
  }

  // this function will handle state management when the user selects a new category
  // we're using this patten since we are updating the state based on the current state
  changeBookCategory(shelfCatValue, bookNameValue, bookId) {
    // this.state.booksCurrentlyReading.pop();
    this.setState(state => ({
      boxOfBooks: this.state.boxOfBooks.forEach(book => {
        if (book.id === bookId) {
          book.id = bookId;
        }
      })
    }));
    // Now we need to call setState here and update the state in this BooksPage component
    BooksAPI.update({ id: bookId }, shelfCatValue);
  }

  render() {
    console.log(this.state.boxOfBooks);
    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
            <BookShelf
              shelfTitle="Currently Reading"
              booksInThisShelf={this.state.booksCurrentlyReading}
              onBookChange={this.changeBookCategory.bind(this)}
            />
            <BookShelf
              shelfTitle="Want to Read"
              booksInThisShelf={this.state.booksWantToRead}
              onBookChange={this.changeBookCategory.bind(this)}
            />
            <BookShelf
              shelfTitle="Read"
              booksInThisShelf={this.state.booksAlreadyRead}
              onBookChange={this.changeBookCategory.bind(this)}
            />
          </div>
        </div>
        <div className="open-search">
          <a onClick={() => this.setState({ showSearchPage: true })}>
            Add a book
          </a>
        </div>
      </div>
    );
  }
}

/*
Main Page for the search page
*/
class SearchPage extends Component {
  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <a
            className="close-search"
            onClick={() => this.setState({ showSearchPage: false })}
          >
            Close
          </a>
          <div className="search-books-input-wrapper">
            {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
            <input type="text" placeholder="Search by title or author" />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid" />
        </div>
      </div>
    );
  }
}

/* ==================== ORIGINAL CODE BELOW ===================== */

class BooksApp extends Component {
  // TODO: Make a 2 large-scale components: one for the Main Page and one for the Search Page
  // You'll use a Router later on to route between these two components

  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false
  };

  render() {
    return (
      <div className="app">
        {this.state.showSearchPage ? <SearchPage /> : <BooksPage />}
      </div>
    );
  }
}

export default BooksApp;
