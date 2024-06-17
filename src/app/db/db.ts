import { ref, push, child, set, serverTimestamp, query, orderByChild, equalTo, get } from "firebase/database";
import { genSalt, hash } from 'bcrypt-ts';

import { database } from '@/firebase/firebase';

export async function createNewUser(username: string, email: string, password: string) {

  genSalt(10)
    .then((salt) => hash(password, salt))
    .then((hashedPassword) => {

      const userInfo = {
        username,
        email,
        hashedPassword,
        // books,
        // reviews,
        createdAt: serverTimestamp(),
      };

      const newUserKey = push(child(ref(database), 'users')).key;

      return set(ref(database, `users/${newUserKey}`), userInfo);
    });
}

export async function createNewBook(key: string, title: string, author: string, isbn: string, coverUrl: string, r: number, g: number, b: number) {
    const bookInfo = {
        key,
        title,
        author,
        isbn,
        coverUrl,
        bgColor: {r, g, b},
        createdAt: serverTimestamp(),
    }

    const newBookKey = push(child(ref(database), 'reviews')).key;

    return set(ref(database, `books/${newBookKey}`), bookInfo);
}

export async function createNewReview(text: string, rating: number) {
    const reviewInfo = {
        text,
        rating,
        createdAt: serverTimestamp(),
    }

    const newReviewKey = push(child(ref(database), 'reviews')).key;

    return set(ref(database, `reviews/${newReviewKey}`), reviewInfo);
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