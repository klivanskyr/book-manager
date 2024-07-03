// Import the functions you need from the SDKs you need
import { Book } from "@/app/types/Book";
import { Shelf } from "@/app/types/Shelf";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { Timestamp, addDoc, collection, deleteDoc, doc, documentId, getDocs, getFirestore, query, setDoc, updateDoc, where, orderBy } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAMnoU4mAQlG95x9YVFiney3dzOpMsXMg",
  authDomain: "book-manager-3fe0f.firebaseapp.com",
  databaseURL: "https://book-manager-3fe0f-default-rtdb.firebaseio.com",
  projectId: "book-manager-3fe0f",
  storageBucket: "book-manager-3fe0f.appspot.com",
  messagingSenderId: "122144402563",
  appId: "1:122144402563:web:a6c77a410b7a727157ffb6",
  measurementId: "G-78DV9XVZFH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth }

export async function createNewUser(userId: string, username: string, email: string, createdWith: string) {
  try {
    //create new user
    await setDoc(doc(db, 'users', userId), {
      username,
      email,
      createdWith,
      createdAt: Timestamp.now()
    });

    //create new all books shelf
    const newShelf = await addDoc(collection(db, 'shelves'), {
      name: 'All Books',
      description: 'All books you have added',
      isPublic: false,
      createdBy: userId
    });

    const shelfId = newShelf.id;
    //create new userShelf for all books
    await setDoc(doc(db, 'userShelves', userId), {});
    await setDoc(doc(db, 'userShelves', userId, 'owned', shelfId), { owned: true });

    return true;
  } catch (error) {
    console.log('Error in createNewUser', error);
    return false;
  }
}

interface Sort {
  field?: string,
  direction?: 'asc' | 'desc'
}
export async function getBooks(userId: string, sort: Sort={}): Promise<Book[] | null> {
  try {
    //get book ids from user
    const userBooks = await getDocs(collection(db, 'users', userId, 'books'));
    const bookIds = userBooks.docs.map(doc => doc.id);

    //get review data from book ids
    const userBooksQuery = query(collection(db, 'userBooks', userId, 'books'), where(documentId(), 'in', bookIds));
    const userBooksDocs = await getDocs(userBooksQuery);
    let reviewsMap = new Map(); //create kv-pair map for reviews
    userBooksDocs.forEach(doc => {
      const reviewData = doc.data();
      reviewsMap.set(doc.id, {
        review: reviewData.review,
        rating: reviewData.rating
      });
    });

    if (userBooksDocs.empty) { 
      console.log('No books found', bookIds, userBooksDocs);
      return []
    };

    //get book data from book ids
    let booksQuery = query(collection(db, 'books'), where(documentId(), 'in', bookIds));
    if (sort.field && sort.direction) {
      if (sort.field === 'rating') {

      } else {
        booksQuery = query(booksQuery, orderBy(sort.field, sort.direction));
      }
    }
    const booksDocs = await getDocs(booksQuery);

    let books: Book[] = [];
    booksDocs.forEach(doc => {
      const reviewInfo = reviewsMap.get(doc.id) || { review: '', rating: 0 } ;
      const bookData = doc.data();
      books.push({
        id: doc.id,
        key: bookData.key,
        title: bookData.title,
        author: bookData.author,
        review: reviewInfo.review,
        rating: reviewInfo.rating,
        isbn: bookData.isbn,
        coverUrl: bookData.coverUrl,
        bgColor: bookData.bgColor,
        imgLoaded: false,
        selected: true
      });
    });
    return books;

  } catch (error) {
    console.log('Error in getBooks', error);
    return null;
  }
}

export async function getShelves(userId: string) {
  try {
    // Get ShelfIds from userShelves. Only owned right now
    const ownedUserShelvesDocs = await getDocs(collection(db, 'userShelves', userId, 'owned'));
    const ownedUserShelvesIds = ownedUserShelvesDocs.docs.map(doc => doc.id);

    // Get shelf data from shelfIds
    const shelvesDocs = await getDocs(query(collection(db, 'shelves'), where(documentId(), 'in', ownedUserShelvesIds)));
    const ownedShelvesData = shelvesDocs.docs.map(doc => doc.data());

    // Get bookId and Review data from shelves
    let shelves: Shelf[] = [];
    ownedUserShelvesIds.forEach(async shelfId => {
      const booksDocs = await getDocs(collection(db, 'shelves', shelfId, 'books'));
      const bookIds = booksDocs.docs.map(doc => doc.id);
      const bookReview = booksDocs.docs.map(doc => doc.data());

      const booksdocs = await getDocs(query(collection(db, 'books'), where(documentId(), 'in', bookIds)));
      let books: Book[] = [];
      booksdocs.forEach(doc => {
        const bookData = doc.data();
        const reviewData = bookReview.find(review => review.id === doc.id);
        books.push({
          id: doc.id,
          key: bookData.key,
          title: bookData.title,
          author: bookData.author,
          review: reviewData?.review || '',
          rating: reviewData?.rating || 0,
          isbn: bookData.isbn,
          coverUrl: bookData.coverUrl,
          bgColor: bookData.bgColor,
          imgLoaded: false,
          selected: true
        });
      });

      shelves.push({
        shelfId,
        name: shelvesDocs.docs.find(doc => doc.id === shelfId)?.data().name || '',
        description: shelvesDocs.docs.find(doc => doc.id === shelfId)?.data().description || '',
        isPublic: shelvesDocs.docs.find(doc => doc.id === shelfId)?.data().isPublic || false,
        createdBy: shelvesDocs.docs.find(doc => doc.id === shelfId)?.data().createdBy || '',
        books,
        shownBooks: books
      });
    });

    return shelves;
  } catch (error) {
    console.log('Error in getShelves', error);
    return null;
  }
}

export async function addBookToUserShelf(book: Book, userId: string, shelfId: string) {
  try {
    //Check if book is in books
    const booksQuery = query(collection(db, 'books'), where('key', '==', book.key));
    const booksDocs = await getDocs(booksQuery);

    if (booksDocs.empty) { //If new book
      //Create book
      const docRef = await addDoc(collection(db, 'books'), {
        title: book.title,
        author: book.author,
        key: book.key,
        isbn: book.isbn,
        coverUrl: book.coverUrl,
        bgColor: { r: book.bgColor.r, b: book.bgColor.b, g: book.bgColor.g },
        createdAt: Timestamp.now()
      });

      //Add book to shelves
      await setDoc(doc(collection(db, 'shelves', shelfId, 'books'), docRef.id), {
        review: '',
        rating: 0,
        isGlobalReview: false, //default to individual reviews
      });

      //Add book to user
      await setDoc(doc(db, 'users', userId, 'books', docRef.id), { selected: true });
    } else { //If book already exists
      const bookId = booksDocs.docs[0].id;

      //Add book to shelves
      await setDoc(doc(collection(db, 'shelves', shelfId, 'books'), bookId), {
        review: '',
        rating: 0,
        isGlobalReview: false, //default to individual reviews
      });

      //Add book to user
      await setDoc(doc(db, 'users', userId, 'books', bookId), { selected: true });
    }
  }
  catch (error) {
    console.log('Error in addBookToUserShelf', error);
  }
}



export async function addBookToUser(book: Book, userId: string) {
  try {
    console.log('Adding book to user', book, userId);
    //Check if book is in books
    const booksQuery = query(collection(db, 'books'), where('key', '==', book.key));
    const booksDocs = await getDocs(booksQuery);

    if (booksDocs.empty) { //If new book
      //Create book
      const docRef = await addDoc(collection(db, 'books'), {
        title: book.title,
        author: book.author,
        key: book.key,
        isbn: book.isbn,
        coverUrl: book.coverUrl,
        bgColor: { r: book.bgColor.r, b: book.bgColor.b, g: book.bgColor.g },
        createdAt: Timestamp.now()
      });

      //Add book to userBooks
      await setDoc(doc(collection(db, 'userBooks', userId, 'books'), docRef.id), {
        review: '',
        rating: 0,
        isGlobalReview: false, //default to individual reviews
      });

      //Add book to user
      await setDoc(doc(db, 'users', userId, 'books', docRef.id), { selected: true });

    } else { //If book already exists
      const bookId = booksDocs.docs[0].id;

      //Add book to userBooks
      await setDoc(doc(collection(db, 'userBooks', userId, 'books'), bookId), {
        review: '',
        rating: 0,
        isGlobalReview: false, //default to individual reviews
      });

      //Add book to user
      await setDoc(doc(db, 'users', userId, 'books', bookId), { selected: true });
    } 
  } catch (error) {
    console.log('Error in addBookToUser', error);
  }
}

export async function removeBookFromUser(book: Book, userId: string) {
  // remove book from users/userId/books/
  await deleteDoc(doc(db, 'users', userId, 'books', book.bookId));

  // remove book from userBooks/userId/books/
  await deleteDoc(doc(db, 'userBooks', userId, 'books', book.bookId));

  // if no other user has the book, remove book from books
  const usersBooksQuery = query(collection(db, 'users'), where(`books.${book.bookId}`, '==', true));
  const usersBooksDocs = await getDocs(usersBooksQuery);

  if (usersBooksDocs.empty) {
    await deleteDoc(doc(db, 'books', book.bookId));
  }
}

export async function updateUserBook(book: Book, userId: string) {
  await updateDoc(doc(db, 'userBooks', userId, 'books', book.bookId), {
    review: book.review,
    rating: book.rating,
    isGlobalReview: false,
    lastUpdated: Timestamp.now()
  });
}

export async function getUserIdByEmail(email: string) {
  const usersQuery = query(collection(db, 'users'), where('email', '==', email));
  const usersDocs = await getDocs(usersQuery);

  if (usersDocs.empty) {
    return null;
  }

  return usersDocs.docs[0].id;
}