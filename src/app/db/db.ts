import { ref, push, child, set, serverTimestamp, query, orderByChild, equalTo, get, DataSnapshot } from "firebase/database";

import { database } from '@/firebase/firebase';
import { Book } from '@/app/types/Book';

type CreatedWith = 'email' | 'google';

export async function createNewBook(key: string, title: string, author: string, isbn: string, coverUrl: string, r: number, g: number, b: number): Promise<string> {
  const bookInfo = {
      key,
      title,
      author,
      isbn,
      coverUrl,
      bgColor: {r, g, b},
      createdAt: serverTimestamp(),
  }

  const newBookKey = push(child(ref(database), 'books')).key as string;

  set(ref(database, `books/${newBookKey}`), bookInfo);
  return newBookKey;
}

export async function createNewUsersBooks(bookId: string, userId: string, text: string, rating: number) {
  const reviewInfo = {
    text,
    rating,
    createdAt: serverTimestamp(),
  }

  return set(ref(database, `usersBooks/${userId}/${bookId}`), reviewInfo);
}

export async function getUserByEmail(email: string) {
  const usersRef = ref(database, 'users');
  const emailQuery = query(usersRef, orderByChild('email'), equalTo(email));

  const snapshot = await get(emailQuery);

  if (snapshot.exists()) {
    const userData = snapshot.val();
    const userId = Object.keys(userData)[0]; // email is unique so only 1

    return { id: userId, ...userData[userId] }
  } else {
    return null;
  }
}

type BookReview = {
  createdAt: number,
  rating: number,
  text: string,
};

export async function loadBooks(snapshot: DataSnapshot) {
  if (!snapshot.exists()) {return []}

  const bookReviews: [string, BookReview][] = Object.entries(snapshot.val());

  let books = [];
  for (let [bookId, bookReviewObject] of bookReviews) {
    const bookRef = ref(database, `books/${bookId}`);
    const bookSnapshot = await get(bookRef);

    if (!bookSnapshot.exists()) {continue} //Book was under userbooks but not in books, handle error

    const bookData = bookSnapshot.val();
    const book: Book = {
      id: bookId,
      key: bookData?.key,
      title: bookData?.title,
      author: bookData?.author,
      review: bookReviewObject.text,
      rating: bookReviewObject.rating,
      isbn: bookData?.isbn,
      coverImage: bookData?.coverUrl,
      bgColor: {r: bookData?.bgColor?.r, g: bookData?.bgColor?.g, b: bookData?.bgColor?.b},
      imgLoaded: false,
      selected: true,
    }
    books.push(book);
  }

  return books;
}

export async function addBookToUser(book: Book, userId: string) {
  //Check if book is in books
  const booksRef = ref(database, 'books');
  const booksQuery = query(booksRef, orderByChild('key'), equalTo(book.key));
  const bookSnapshot = await get(booksQuery);

  if (bookSnapshot.exists()) {
    const bookId = Object.keys(bookSnapshot.val())[0];
    set(ref(database, `usersBooks/${userId}/${bookId}`), { title: book.title, author: book.author, text: '', rating: 0, createdAt: serverTimestamp() }); //create review

  } else { //if not in books, add book to books and userBooks
    const newBookId = await createNewBook(book.key, book.title, book.author, book.isbn, book.coverImage, book.bgColor.r, book.bgColor.g, book.bgColor.b);
    set(ref(database, `usersBooks/${userId}/${newBookId}`), { title: book.title, author: book.author, text: '', rating: 0, createdAt: serverTimestamp() }); //create review
  }
}

export async function removeBookFromUser(bookId: string, userId: string) {
  //remove book from userBooks
  set(ref(database, `usersBooks/${userId}/${bookId}`), null);

  //If no other user has the book, remove book from books
  const usersBooksRef = ref(database, `usersBooks`);
  const usersBooksQuery = query(usersBooksRef, orderByChild('bookId'), equalTo(bookId));
  const snapshot = await get(usersBooksQuery);

  if (!snapshot.exists()) {
    set(ref(database, `books/${bookId}`), null);
  } 
  return 
}

export async function updateUserBook(updatedBook: Book, userId: string) {
  const userBookRef = ref(database, `usersBooks/${userId}/${updatedBook.id}`);
  set(userBookRef, { text: updatedBook.review, rating: updatedBook.rating });
  return;
}

