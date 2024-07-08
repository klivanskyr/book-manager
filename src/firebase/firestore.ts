// Import the functions you need from the SDKs you need
import { Book } from "@/app/types/Book";
import { Shelf } from "@/app/types/Shelf";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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


    //create fast lookup denormailized data for user books
    await setDoc(doc(db, 'users', userId, 'shelves', shelfId), {
      name: 'All Books',
      description: 'All books you have added',
      isPublic: false,
      createdBy: userId
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
    console.log('Getting shelves for user', userId);
    const shelvesRef = await getDocs(collection(db, 'users', userId, 'shelves'));
    let shelves: Shelf[] = [];
    shelvesRef.forEach(doc => {
      shelves.push({
        shelfId: doc.id || '',
        name: doc.data().name || '',
        description: doc.data().description || '',
        isPublic: doc.data().isPublic || false,
        createdBy: doc.data().createdBy || '',
        books: doc.data().books || [],
        shownBooks: doc.data().books || []
      });
    });
    console.log('Shelves:', shelves);
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

export async function updateBookOnUserShelf(newBook: Book, userId: string, shelfId: string) {
  try {
    console.log('Updating book on user shelf', newBook, userId, shelfId);
    const bookRef = doc(db, 'shelves', shelfId, 'books', newBook.bookId);
    await updateDoc(bookRef, {
      review: newBook.review,
      rating: newBook.rating,
      isGlobalReview: false,
    });
  } catch (error) {
    console.log('Error in updateBookOnUserShelf', error);
  }
}

export async function addBooktoUserShelves(book: Book, userId: string, shelfIds: string[]) {
  if (shelfIds.length === 0) return console.log('No shelves to add book to');
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

      //Add book to shelves, since it was just created, it will not be in any shelves
      shelfIds.forEach(async shelfId => {
        await setDoc(doc(collection(db, 'shelves', shelfId, 'books'), docRef.id), {
          review: '',
          rating: 0,
          isGlobalReview: false, //default to individual reviews
        });
      });

      //Add book to user
      await setDoc(doc(db, 'users', userId, 'books', docRef.id), { selected: true });

    } else { //If book already exists
      const bookId = booksDocs.docs[0].id;

      //Add book to shelves but first check if it is already in the shelf
      let addBookToUserField = false;
      shelfIds.forEach(async shelfId => {
        const shelfBooksDocs = await getDocs(query(collection(db, 'shelves', shelfId, 'books'), where('key', '==', book.key)));
        if (!shelfBooksDocs.empty) { return } //If book is already in shelf, skip
        addBookToUserField = true;
        await setDoc(doc(collection(db, 'shelves', shelfId, 'books'), bookId), {
          review: '',
          rating: 0,
          isGlobalReview: false, //default to individual reviews
        });
      });

      if (addBookToUserField) {
        //Add book to user
        await setDoc(doc(db, 'users', userId, 'books', bookId), { selected: true });
      }

    }
  } catch (error) {
    console.log('Error in addBookToUserShelves', error);
  }
}

export async function addShelfToUser(shelf: Shelf, userId: string) {
  try {
    //Create shelf
    const docRef = await addDoc(collection(db, 'shelves'), {
      name: shelf.name,
      description: shelf.description,
      isPublic: shelf.isPublic,
      createdBy: userId
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