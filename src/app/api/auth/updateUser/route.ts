import { db } from "@/firebase";
import { adminAuth } from "@/firebase/firebase-admin";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const { userId, newUsername, newEmail, newImage } = await request.json();

        const error = await updateUser(userId, { username: newUsername, email: newEmail, profileImage: newImage });
        if (error) return NextResponse.json({ status: 500, message: error });
        else return NextResponse.json({ status: 200, message: 'User updated successfully' });
    } catch (error) {
        return NextResponse.json({ status: 500, message: `${error}` });
    }
}

/** THIS FUNCTION MUST BE USED SERVER SIDE */
type Option<T> = T | null;
async function updateUser(userId: string, newUserData: { username?: string, email?: string, profileImage?: string }): Promise<Option<string>> {
    try {
      const user = await adminAuth.getUser(userId)
      if (!user) return 'Could not find user';
  
      let authData = {};
      let dbData = {};
      if (!newUserData.username && !newUserData.email && !newUserData.profileImage) {
        return 'No data to update';
      }
      if (newUserData.username) {
        authData = { ...authData, displayName: newUserData.username };
        dbData = { ...dbData, username: newUserData.username, usernameLowercase: newUserData.username.toLowerCase() };
      } 
      if (newUserData.email) {
        authData = { ...authData, email: newUserData.email };
        dbData = { ...dbData, email: newUserData.email };
      }
      if (newUserData.profileImage) {
        authData = { ...authData, photoUrl: newUserData.profileImage };
        dbData = { ...dbData, profileImage: newUserData.profileImage };
      }
  
      // Update user in auth
      adminAuth.updateUser(userId, authData)
      .catch(error => {
        console.log('Error in updateUser auth', error);
        return `${error}`;
      })
  
      // Update user in database
      setDoc(doc(db, 'users', userId), dbData, { merge: true })
      .catch(error => {
        console.log('Error in updateUser db', error);
        return `${error}`;
      });
      
      // Update shelves with new username
      if (newUserData.username) {
        const shelvesDocs = await getDocs(query(collection(db, 'shelves'), where('createdById', '==', userId)));
        shelvesDocs.docs.forEach(shelfDocs => {
          setDoc(doc(db, 'shelves', shelfDocs.id), {
            createdByName: newUserData.username,
            createdByNameLowerCase: newUserData.username?.toLowerCase(),
            ...(newUserData.profileImage ? { createdByImage: newUserData.profileImage } : {})
          }, { merge: true });
        });
      }
  
      // update user/userid/ownedShelves with new username
      if (newUserData.username) {
        const userShelvesDocs = await getDocs(collection(db, 'users', userId, 'ownedShelves'));
        userShelvesDocs.docs.forEach(shelfDocs => {
          setDoc(doc(db, 'users', userId, 'ownedShelves', shelfDocs.id), {
            createdByName: newUserData.username,
            createdByNameLowerCase: newUserData.username?.toLowerCase(),
            ...(newUserData.profileImage ? { createdByImage: newUserData.profileImage } : {})
          }, { merge: true });
        });
      }
  
      //update every users followedshelves with new username
      if (newUserData.username) {
        const usersDocs = await getDocs(collection(db, 'users'));
        usersDocs.docs.forEach(userDoc => {
          const userShelvesDocs = getDocs(collection(db, 'users', userDoc.id, 'followedShelves'));
          userShelvesDocs.then(shelvesDocs => {
            shelvesDocs.docs.forEach(shelfDocs => {
              if (shelfDocs.data().createdById === userId) {
                setDoc(doc(db, 'users', userDoc.id, 'followedShelves', shelfDocs.id), {
                  createdByName: newUserData.username,
                  createdByNameLowerCase: newUserData.username?.toLowerCase(),
                  ...(newUserData.profileImage ? { createdByImage: newUserData.profileImage } : {})
                }, { merge: true });
              }
            });
          });
        });
      }
  
      console.log('here');
      return null;
    } catch (error) {
      console.log('Error in updateUser', error);
      return `${error}`;
    }
  }