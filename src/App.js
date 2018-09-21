import React, { Component } from "react";
import * as BooksAPI from "./BooksAPI";
import "./App.css";

/*
========== This is for a selection menu ===========
*/
class Select extends Component {
  state = {
    bookName: this.props.bookName
  };
  render() {
    console.log(this.props.currentValue);
    return (
      <select
        onChange={e =>
          this.props.onBookChange(e.target.value, this.state.bookName)
        }
      >
        <option value="move" disabled>
          Move to...
        </option>
        <option value="currentlyReading">Currently Reading</option>
        <option value="wantToRead">Want to Read</option>
        <option value="read">Read</option>
        <option value="none" defaultValue="Selected">
          None
        </option>
      </select>
    );
  }
}

/*
========== This is for an individual book item ===========
*/
class Book extends Component {
  render() {
    // console.log(this.props.image);
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
    // console.log(this.props);
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
  state = {
    boxOfBooks: [],
    booksCurrentlyReading: [],
    booksWantToRead: [],
    booksAlreadyRead: []
  };

  // Get a list of all the books here with AJAX request
  componentDidMount() {
    console.log("componentDidMount Run");
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
    console.log(this.state.boxOfBooks);
  }

  // this function will handle state management when the user selects a new category
  // we're using this patten since we are updating the state based on the current state
  changeBookCategory(shelfCatValue, bookNameValue) {
    console.log("Heyyy");
    console.log(shelfCatValue);
    console.log(bookNameValue);
    console.log(this.state.boxOfBooks); // this works...but why?
    this.state.booksCurrentlyReading.pop();

    this.setState(state => ({
      boxOfBooks: [shelfCatValue, bookNameValue]
    }));
    // Now we need to call setState here and update the state in this BooksPage component
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
              onBookChange={this.changeBookCategory}
            />
            <BookShelf
              shelfTitle="Read"
              booksInThisShelf={this.state.booksAlreadyRead}
              onBookChange={this.changeBookCategory}
            />

            <div className="bookshelf">
              <h2 className="bookshelf-title">Want to Read</h2>
              <div className="bookshelf-books">
                <ol className="books-grid">
                  <li>
                    <div className="book">
                      <div className="book-top">
                        <div
                          className="book-cover"
                          style={{
                            width: 128,
                            height: 193,
                            backgroundImage:
                              'url("http://books.google.com/books/content?id=uu1mC6zWNTwC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73pGHfBNSsJG9Y8kRBpmLUft9O4BfItHioHolWNKOdLavw-SLcXADy3CPAfJ0_qMb18RmCa7Ds1cTdpM3dxAGJs8zfCfm8c6ggBIjzKT7XR5FIB53HHOhnsT7a0Cc-PpneWq9zX&source=gbs_api")'
                          }}
                        />
                        <div className="book-shelf-changer">
                          <select>
                            <option value="move" disabled>
                              Move to...
                            </option>
                            <option value="currentlyReading">
                              Currently Reading
                            </option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                          </select>
                        </div>
                      </div>
                      <div className="book-title">1776</div>
                      <div className="book-authors">David McCullough</div>
                    </div>
                  </li>
                  <li>
                    <div className="book">
                      <div className="book-top">
                        <div
                          className="book-cover"
                          style={{
                            width: 128,
                            height: 192,
                            backgroundImage:
                              'url("http://books.google.com/books/content?id=wrOQLV6xB-wC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72G3gA5A-Ka8XjOZGDFLAoUeMQBqZ9y-LCspZ2dzJTugcOcJ4C7FP0tDA8s1h9f480ISXuvYhA_ZpdvRArUL-mZyD4WW7CHyEqHYq9D3kGnrZCNiqxSRhry8TiFDCMWP61ujflB&source=gbs_api")'
                          }}
                        />
                        <div className="book-shelf-changer">
                          <select>
                            <option value="move" disabled>
                              Move to...
                            </option>
                            <option value="currentlyReading">
                              Currently Reading
                            </option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                          </select>
                        </div>
                      </div>
                      <div className="book-title">
                        Harry Potter and the Sorcerer's Stone
                      </div>
                      <div className="book-authors">J.K. Rowling</div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
            <div className="bookshelf">
              <h2 className="bookshelf-title">Read</h2>
              <div className="bookshelf-books">
                <ol className="books-grid">
                  <li>
                    <div className="book">
                      <div className="book-top">
                        <div
                          className="book-cover"
                          style={{
                            width: 128,
                            height: 192,
                            backgroundImage:
                              'url("http://books.google.com/books/content?id=pD6arNyKyi8C&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE70Rw0CCwNZh0SsYpQTkMbvz23npqWeUoJvVbi_gXla2m2ie_ReMWPl0xoU8Quy9fk0Zhb3szmwe8cTe4k7DAbfQ45FEzr9T7Lk0XhVpEPBvwUAztOBJ6Y0QPZylo4VbB7K5iRSk&source=gbs_api")'
                          }}
                        />
                        <div className="book-shelf-changer">
                          <select>
                            <option value="move" disabled>
                              Move to...
                            </option>
                            <option value="currentlyReading">
                              Currently Reading
                            </option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                          </select>
                        </div>
                      </div>
                      <div className="book-title">The Hobbit</div>
                      <div className="book-authors">J.R.R. Tolkien</div>
                    </div>
                  </li>
                  <li>
                    <div className="book">
                      <div className="book-top">
                        <div
                          className="book-cover"
                          style={{
                            width: 128,
                            height: 174,
                            backgroundImage:
                              'url("http://books.google.com/books/content?id=1q_xAwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE712CA0cBYP8VKbEcIVEuFJRdX1k30rjLM29Y-dw_qU1urEZ2cQ42La3Jkw6KmzMmXIoLTr50SWTpw6VOGq1leINsnTdLc_S5a5sn9Hao2t5YT7Ax1RqtQDiPNHIyXP46Rrw3aL8&source=gbs_api")'
                          }}
                        />
                        <div className="book-shelf-changer">
                          <select>
                            <option value="move" disabled>
                              Move to...
                            </option>
                            <option value="currentlyReading">
                              Currently Reading
                            </option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                          </select>
                        </div>
                      </div>
                      <div className="book-title">
                        Oh, the Places You'll Go!
                      </div>
                      <div className="book-authors">Seuss</div>
                    </div>
                  </li>
                  <li>
                    <div className="book">
                      <div className="book-top">
                        <div
                          className="book-cover"
                          style={{
                            width: 128,
                            height: 192,
                            backgroundImage:
                              'url("http://books.google.com/books/content?id=32haAAAAMAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72yckZ5f5bDFVIf7BGPbjA0KYYtlQ__nWB-hI_YZmZ-fScYwFy4O_fWOcPwf-pgv3pPQNJP_sT5J_xOUciD8WaKmevh1rUR-1jk7g1aCD_KeJaOpjVu0cm_11BBIUXdxbFkVMdi&source=gbs_api")'
                          }}
                        />
                        <div className="book-shelf-changer">
                          <select>
                            <option value="move" disabled>
                              Move to...
                            </option>
                            <option value="currentlyReading">
                              Currently Reading
                            </option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                          </select>
                        </div>
                      </div>
                      <div className="book-title">
                        The Adventures of Tom Sawyer
                      </div>
                      <div className="book-authors">Mark Twain</div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
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
