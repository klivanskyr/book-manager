// Import the functions you need from the SDKs you need
import { Book } from "@/types/Book";
import { Shelf } from "@/types/Shelf";
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { Timestamp, addDoc, collection, deleteDoc, doc, documentId, getDocs, getFirestore, query, setDoc, updateDoc, where, orderBy, getDoc } from "firebase/firestore";
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
      profileImage: '',
      createdAt: Timestamp.now()
    });
    return true;

  } catch (error) {
    console.log('Error in createNewUser', error);
    return false;
  }
}

export async function getUserShelves(userId: string): Promise<Shelf[] | null> {
  try {
    // console.log('Getting shelves for user', userId);
    const shelvesRef = await getDocs(collection(db, 'users', userId, 'shelves'));
    const shelfPromises: Promise<Shelf>[] = shelvesRef.docs.map(async doc => {
      const shelfData = doc.data();
      const booksRef = await getDocs(collection(db, 'users', userId, 'shelves', doc.id, 'books'));
      const books: Book[] = booksRef.docs.map(bookDoc => {
        const bookData = bookDoc.data();
        return ({
          bookId: bookDoc.id,
          key: bookData.key,
          title: bookData.title,
          author: bookData.author,
          review: bookData.review,
          rating: bookData.rating,
          isbn: bookData.isbn,
          bgColor: bookData.bgColor,
          coverUrl: bookData.coverUrl,
          imgLoaded: false,
          selected: true
        });
      });

      return ({
        shelfId: doc.id,
        name: shelfData.name,
        description: shelfData.description,
        isPublic: shelfData.isPublic,
        followers: shelfData.followers,
        image: shelfData.image,
        createdById: shelfData.createdById,
        createdByName: shelfData.createdByName,
        createdByImage: shelfData.createdByImage,
        createdAt: shelfData.createdAt,
        books: books,
        shownBooks: books
      });
    });

    const shelves = await Promise.all(shelfPromises);

    return shelves;
  } catch (error) {
    console.log('Error in getUserShelves', error);
    return null;
  }
}

export async function getUser(userId: string): Promise<{ username: string, profileImage: string, email: string } | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) { return null }
    const userData = userDoc.data();
    return {
      username: userData.username,
      profileImage: userData.profileImage,
      email: userData.email,
    };
  } catch (error) {
    console.log('Error in getUser', error);
    return null;
  }
}

export async function addBooktoUserShelves(book: Book, userId: string, shelfIds: string[]) {
  if (shelfIds.length === 0) return console.log('No shelves to add book to');
  shelfIds = shelfIds.filter(shelfId => shelfId !== 'all-books'); //remove all-books shelf because its not a real shelf
  try {
    //Check if book is in books
    const booksQuery = query(collection(db, 'books'), where('key', '==', book.key));
    const booksDocs = await getDocs(booksQuery);

    let bookId = '';

    const bookData = {
      title: book.title,
      author: book.author,
      key: book.key,
      isbn: book.isbn,
      coverUrl: book.coverUrl,
      bgColor: { r: book.bgColor.r, b: book.bgColor.b, g: book.bgColor.g },
      createdAt: Timestamp.now()
    };

    const reviewData = {
      review: '',
      rating: 0,
      isGlobalReview: false //default to individual reviews
    };

    if (booksDocs.empty) { //If new book
      //Create book
      const docRef = await addDoc(collection(db, 'books'), bookData);
      bookId = docRef.id;
    } else { //If book already exists
      bookId = booksDocs.docs[0].id;
    }

    //Add book to shelves if it is not already in shelf
    const shelfPromises = shelfIds.map(shelfId => {
      const bookRef = doc(db, 'shelves', shelfId, 'books', bookId);
      return setDoc(bookRef, { ...bookData, ...reviewData }, { merge: true }); //merge to not overwrite existing data if it exists
    });

    await Promise.all(shelfPromises);

    //Add book to user/shelves if it is not already in shelf
    const userShelfPromises = shelfIds.map(shelfId => {
      const bookRef = doc(db, 'users', userId, 'shelves', shelfId, 'books', bookId);
      return setDoc(bookRef, { ...bookData, ...reviewData }, { merge: true }); //merge to not overwrite existing data if it exists
    });

    await Promise.all(userShelfPromises);

    //Add book to user if it is not already in user
    const userBookRef = doc(db, 'users', userId, 'books', bookId);
    await setDoc(userBookRef, { ...bookData, ...reviewData }, { merge: true }); //merge to not overwrite existing data if it

    return;

  } catch (error) {
    console.log('Error in addBookToUserShelves', error);
  }
}

export async function addShelfToUser(shelf: Shelf, userId: string) {
  if (shelf.name === '') return console.log('Shelf name is required');
  if (shelf.name === 'all-books') return console.log('Shelf name cannot be all-books');
  try {
    //Get user info
    const user = await getUser(userId);
    console.log('User:', user);
    if (!user) return console.log('User not found');

    const newShelf = {
      name: shelf.name,
      description: shelf.description,
      followers: shelf.followers || 0,
      isPublic: shelf.isPublic,
      image: shelf.image || '',
      createdById: userId,
      createdByName: user.username,
      createdByImage: user.profileImage,
      createdAt: Timestamp.now()
    };

    //Create shelf
    const docRef = await addDoc(collection(db, 'shelves'), newShelf);

    //Add shelf to userShelves
    await setDoc(doc(db, 'userShelves', userId, 'owned', docRef.id), { owned: true });

    //Add shelf to user
    await setDoc(doc(db, 'users', userId, 'shelves', docRef.id), newShelf);
    return;
  } catch (error) {
    console.log('Error in addShelfToUser', error);
    return;
  }
}

type Option<T> = T | null;
/** Gets a shelf by its Id. Returns Shelf if found else returns null */
export async function getShelf(shelfId: string): Promise<Option<Shelf>> {
  try {
    const shelfRef = await getDoc(doc(db, 'shelves', shelfId));
    if (!shelfRef.exists()) { return null }
    const shelfData = shelfRef.data();
    const booksRef = await getDocs(collection(db, 'shelves', shelfId, 'books'));
    const books = booksRef.docs.map(bookDoc => {
      const bookData = bookDoc.data();
      return {
        bookId: bookDoc.id,
        key: bookData.key,
        title: bookData.title,
        author: bookData.author,
        review: bookData.review,
        rating: bookData.rating,
        isbn: bookData.isbn,
        coverUrl: bookData.coverUrl,
        bgColor: bookData.bgColor,
        imgLoaded: false,
        selected: true
      };
    });

    return {
      shelfId,
      name: shelfData.name,
      description: shelfData.description,
      followers: shelfData.followers,
      isPublic: shelfData.isPublic,
      image: shelfData.image,
      createdById: shelfData.createdById,
      createdByName: shelfData.createdByName,
      createdByImage: shelfData.createdByImage,
      createdAt: shelfData.createdAt,
      books,
      shownBooks: books
    };
    
  } catch (error) {
    console.log('Error in getShelf', error);
    return null;
  } 
}

/** Gets all the books by userId. Returns a Shelf */
export async function getAllBooks(userId: string) : Promise<Shelf> {
  const booksRef = await getDocs(collection(db, 'users', userId, 'books'));
  const books = booksRef.docs.map(doc => {
    const bookData = doc.data();
    return {
      bookId: doc.id,
      key: bookData.key,
      title: bookData.title,
      author: bookData.author,
      review: bookData.review,
      rating: bookData.rating,
      isbn: bookData.isbn,
      coverUrl: bookData.coverUrl,
      bgColor: bookData.bgColor,
      imgLoaded: false,
      selected: true
    };
  });

  const shelf: Shelf = {
    name: 'All Books',
    description: 'All books in your collections',
    followers: 0,
    image: '',
    createdById: userId,
    createdByImage: '',
    createdByName: 'You',
    createdAt: Timestamp.now(),
    isPublic: false,
    shelfId: 'all-books',
    books,
    shownBooks: books
  };

  return shelf;
}

/**
 * Removes a book from a shelf (shelves/shelfId/books/bookId)
 * Removes a book from a user's shelf (users/userId/shelves/shelfId/books/bookId)
 * If last instance of book in the user's shelves, removes book from user/books/bookId
 * If last instance of book in all user's shelves, removes book from books/bookId
 * @param userId
 * @param shelfId
 * @param bookId
 * @returns null if successful, else returns error message
 */
export async function removeBookFromShelf(userId: string, shelfId: string, bookId: string): Promise<Option<string>> {
  try {
    // remove book from shelves/shelfId/books/bookId
    await deleteDoc(doc(db, 'shelves', shelfId, 'books', bookId));

    // remove book from users/UserId/shelves/shelfId/books/bookId
    await deleteDoc(doc(db, 'users', userId, 'shelves', shelfId, 'books', bookId));

    // if last instance of book in the user's shelves, remove the book from user/books/bookId
    // Get all of the user's shelves
    const userShelvesDocs = await getDocs(collection(db, 'users', userId, 'shelves'));

    // Check if the book is in any of the user's shelves
    // Loop through each shelf and check if the book is in it
    const instanceInUserShelves = userShelvesDocs.docs.some(async shelfDoc => {
      const shelfBooksDocs = await getDocs(collection(db, 'users', userId, 'shelves', shelfDoc.id, 'books'));
      return shelfBooksDocs.docs.some(bookDoc => bookDoc.id === bookId);
    });

    if (!instanceInUserShelves) {
      await deleteDoc(doc(db, 'users', userId, 'books', bookId));
    }

    // if last instance of book in all user's shelves, remove book from books/bookId
    const usersDocs = await getDocs(collection(db, 'users'));
    const instanceInAllUsers = usersDocs.docs.some(async userDoc => {
      const userBooksDocs = await getDocs(collection(db, 'users', userDoc.id, 'books'));
      return userBooksDocs.docs.some(bookDoc => bookDoc.id === bookId);
    });

    if (!instanceInAllUsers) {
      await deleteDoc(doc(db, 'books', bookId));
    }

    return null;

  } catch (error) {
    console.log('Error in removeBookFromShelf', error);
    return `${error}`
  }
}

/**
 * Updates users/userId/shelves/shelfId/books/bookId and shelves/shelfId/books/bookId with new Rating and/or Review
 * @param newBook 
 * @param userId 
 * @param shelfId 
 * @returns string if error, else null
 */
export async function updateBookOnUserShelf(userId: string, shelfId: string, newBook: Book): Promise<Option<string>> {
  try {
    const bookDoc = doc(db, 'users', userId, 'shelves', shelfId, 'books', newBook.bookId);
    await setDoc(bookDoc, {
      review: newBook.review,
      rating: newBook.rating,
    },
    { merge: true });

    const shelfBookDoc = doc(db, 'shelves', shelfId, 'books', newBook.bookId);
    await setDoc(shelfBookDoc, {
      review: newBook.review,
      rating: newBook.rating,
    },
    { merge: true });
    
    return null;

  } catch (error) {
    console.log('Error in updateBookOnUserShelf', error);
    return `${error}`;
  }
}

export type Sort = {

}

export type Filter = {

}

/** 
 * Fetches shelves from database. Can give parameters for sorting and filtering. Be default shows most recent shelves
 * Returns a shelf array or null if error
 * @param sort - Sort object with field and direction
 * @param filter - Filter object with field and value
 * @returns Shelf[] | null
 */
export async function getAllPublicShelves(sort?: Sort, filter?: Filter): Promise<Option<Shelf[]>> {
  try {
    const shelvesQuery = query(collection(db, 'shelves'), where('isPublic', '==', true));
    const shelvesRef = await getDocs(shelvesQuery);
    const shelvesPromises: Promise<Shelf>[] = shelvesRef.docs.map(async doc => {
      const shelfData = doc.data();
      const booksRef = await getDocs(collection(db, 'shelves', doc.id, 'books'));
      const books: Book[] = booksRef.docs.map(bookDoc => {
        const bookData = bookDoc.data();
        return {
          bookId: bookDoc.id,
          key: bookData.key,
          title: bookData.title,
          author: bookData.author,
          review: bookData.review,
          rating: bookData.rating,
          isbn: bookData.isbn,
          coverUrl: bookData.coverUrl,
          bgColor: bookData.bgColor,
          imgLoaded: false,
          selected: true
        };
      });

      return {
        shelfId: doc.id,
        name: shelfData.name,
        description: shelfData.description,
        followers: shelfData.followers,
        isPublic: shelfData.isPublic,
        image: shelfData.image,
        createdById: shelfData.createdById,
        createdByName: shelfData.createdByName,
        createdByImage: shelfData.createdByImage,
        createdAt: shelfData.createdAt,
        books,
        shownBooks: books
      };
    });
    
    const shelves = await Promise.all(shelvesPromises);
    return shelves;
  } catch (error) {
    console.log('Error in getExploreShelves', error);
    return null;
  }

}