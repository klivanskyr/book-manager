// Import the functions you need from the SDKs you need
import { Book } from "@/app/types/Book";
import { Shelf } from "@/app/types/Shelf";
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
        bookId: doc.id,
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

export async function getShelves(userId: string): Promise<Shelf[] | null> {
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
        createdById: shelfData.createdById,
        createdByName: shelfData.createdByName,
        createdByImage: shelfData.createdByImage,
        books: books,
        shownBooks: books
      });
    });

    const shelves = await Promise.all(shelfPromises);

    return shelves;
  } catch (error) {
    console.log('Error in getShelves', error);
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

// export async function getShelf(shelfId: string): Promise<Shelf | null> {
//   try {
//     // get the shelf metadata
//     const shelfDoc = await getDoc(doc(db, 'shelves', shelfId));
//     if (!shelfDoc.exists()) { return null }
//     const shelfData = shelfDoc.data();

//     // get book ids 
//     const shelfBooksDocs = await getDocs(collection(db, 'shelves', shelfId, 'books'));
//     let books: Book[] = [];
//     if (!shelfBooksDocs.empty) { 
//       const bookIds = shelfBooksDocs.docs.map(doc => doc.id);
//       const bookReviews = shelfBooksDocs.docs.map(doc => doc.data());

//       // create books
//       bookIds.map(async bookId => {
//         const bookDoc = await getDoc(doc(db, 'books', bookId));
//         if (!bookDoc.exists()) { return }
//         const bookData = bookDoc.data();
//         const reviewData = bookReviews.find(review => review.id === bookId);
//         books.push({
//           bookId,
//           key: bookData.key,
//           title: bookData.title,
//           author: bookData.author,
//           review: reviewData?.review || '',
//           rating: reviewData?.rating || 0,
//           isbn: bookData.isbn,
//           coverUrl: bookData.coverUrl,
//           bgColor: bookData.bgColor,
//           imgLoaded: false,
//           selected: true
//         });
//     });

//     return {
//       shelfId,
//       name: shelfData.name,
//       description: shelfData.description,
//       isPublic: shelfData.isPublic,
//       createdBy: shelfData.createdBy,
//       books,
//       shownBooks: books
//     };
//   } else {
//       return {
//         shelfId,
//         name: shelfData.name,
//         description: shelfData.description,
//         isPublic: shelfData.isPublic,
//         createdBy: shelfData.createdBy,
//         books: [],
//         shownBooks: []
//       };
//   }

//   } catch (error) {
//     console.log('Error in getShelf', error);
//     return null
//   }
// }

// export async function addBookToUserShelf(book: Book, userId: string, shelfId: string) {
//   try {
//     //Check if book is in books
//     const booksQuery = query(collection(db, 'books'), where('key', '==', book.key));
//     const booksDocs = await getDocs(booksQuery);

//     if (booksDocs.empty) { //If new book
//       //Create book
//       const docRef = await addDoc(collection(db, 'books'), {
//         title: book.title,
//         author: book.author,
//         key: book.key,
//         isbn: book.isbn,
//         coverUrl: book.coverUrl,
//         bgColor: { r: book.bgColor.r, b: book.bgColor.b, g: book.bgColor.g },
//         createdAt: Timestamp.now()
//       });

//       //Add book to shelves
//       await setDoc(doc(collection(db, 'shelves', shelfId, 'books'), docRef.id), {
//         review: '',
//         rating: 0,
//         isGlobalReview: false, //default to individual reviews
//       });

//       //Add book to user/books
//       await setDoc(doc(db, 'users', userId, 'books', docRef.id), { selected: true });

//       //add book to user/shelves/books
//       await setDoc(doc(db, 'users', userId, 'shelves', shelfId, 'books', docRef.id), { 
//         review: '',
//         rating: 0,
//         isGlobalReview: false //default to individual reviews
//        });

//       //Add book to
//     } else { //If book already exists
//       const bookId = booksDocs.docs[0].id;

//       //Add book to shelves
//       await setDoc(doc(collection(db, 'shelves', shelfId, 'books'), bookId), {
//         review: '',
//         rating: 0,
//         isGlobalReview: false, //default to individual reviews
//       });

//       //Add book to user
//       await setDoc(doc(db, 'users', userId, 'books', bookId), { selected: true });

//       //Add book to user/shelves/books
//       await setDoc(doc(db, 'users', userId, 'shelves', shelfId, 'books', bookId), {
//         review: '',
//         rating: 0,
//         isGlobalReview: false //default to individual reviews
//       }); 
//     }
//   }
//   catch (error) {
//     console.log('Error in addBookToUserShelf', error);
//   }
// }

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

    //Create shelf
    const docRef = await addDoc(collection(db, 'shelves'), {
      name: shelf.name,
      description: shelf.description,
      isPublic: shelf.isPublic,
      createdById: userId,
      createdByName: user.username,
      createdByImage: user.profileImage,
      createdAt: Timestamp.now()
    });

    //Add shelf to userShelves
    await setDoc(doc(db, 'userShelves', userId, 'owned', docRef.id), { owned: true });

    //Add shelf to user
    await setDoc(doc(db, 'users', userId, 'shelves', docRef.id), {
      name: shelf.name,
      description: shelf.description,
      isPublic: shelf.isPublic,
      createdBy: userId
    });
    return;
  } catch (error) {
    console.log('Error in addShelfToUser', error);
    return;
  }
}

// export async function addBookToUser(book: Book, userId: string) {
//   try {
//     console.log('Adding book to user', book, userId);
//     //Check if book is in books
//     const booksQuery = query(collection(db, 'books'), where('key', '==', book.key));
//     const booksDocs = await getDocs(booksQuery);

//     if (booksDocs.empty) { //If new book
//       //Create book
//       const docRef = await addDoc(collection(db, 'books'), {
//         title: book.title,
//         author: book.author,
//         key: book.key,
//         isbn: book.isbn,
//         coverUrl: book.coverUrl,
//         bgColor: { r: book.bgColor.r, b: book.bgColor.b, g: book.bgColor.g },
//         createdAt: Timestamp.now()
//       });

//       //Add book to userBooks
//       await setDoc(doc(collection(db, 'userBooks', userId, 'books'), docRef.id), {
//         review: '',
//         rating: 0,
//         isGlobalReview: false, //default to individual reviews
//       });

//       //Add book to user
//       await setDoc(doc(db, 'users', userId, 'books', docRef.id), { selected: true });

//     } else { //If book already exists
//       const bookId = booksDocs.docs[0].id;

//       //Add book to userBooks
//       await setDoc(doc(collection(db, 'userBooks', userId, 'books'), bookId), {
//         review: '',
//         rating: 0,
//         isGlobalReview: false, //default to individual reviews
//       });

//       //Add book to user
//       await setDoc(doc(db, 'users', userId, 'books', bookId), { selected: true });
//     } 
//   } catch (error) {
//     console.log('Error in addBookToUser', error);
//   }
// }

// export async function removeBookFromUser(book: Book, userId: string) {
//   // remove book from users/userId/books/
//   await deleteDoc(doc(db, 'users', userId, 'books', book.bookId));

//   // remove book from userBooks/userId/books/
//   await deleteDoc(doc(db, 'userBooks', userId, 'books', book.bookId));

//   // if no other user has the book, remove book from books
//   const usersBooksQuery = query(collection(db, 'users'), where(`books.${book.bookId}`, '==', true));
//   const usersBooksDocs = await getDocs(usersBooksQuery);

//   if (usersBooksDocs.empty) {
//     await deleteDoc(doc(db, 'books', book.bookId));
//   }
// }

// export async function updateUserBook(book: Book, userId: string) {
//   await updateDoc(doc(db, 'userBooks', userId, 'books', book.bookId), {
//     review: book.review,
//     rating: book.rating,
//     isGlobalReview: false,
//     lastUpdated: Timestamp.now()
//   });
// }

// export async function getUserIdByEmail(email: string) {
//   const usersQuery = query(collection(db, 'users'), where('email', '==', email));
//   const usersDocs = await getDocs(usersQuery);

//   if (usersDocs.empty) {
//     return null;
//   }

//   return usersDocs.docs[0].id;
// }

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
      isPublic: shelfData.isPublic,
      createdById: shelfData.createdById,
      createdByName: shelfData.createdByName,
      createdByImage: shelfData.createdByImage,
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
    createdById: userId,
    createdByImage: '',
    createdByName: 'You',
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