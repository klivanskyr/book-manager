'use client';

//dependencies
import { ReactElement, useContext } from "react";
import { useRouter } from 'next/navigation';
import { compare } from 'bcrypt-ts';

//survey
import 'survey-core/defaultV2.css';
import { PlainLight } from "survey-core/themes/plain-light";
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';

//local imports
import { User, UserContext } from '@/app/types/UserContext'; 

//Database
import { ref, onValue, query, orderByValue, equalTo, get } from 'firebase/database';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { database, auth } from "@/firebase/firebase";
import { createNewUser, getUserByEmail, loadBooks } from "../db/db";


export default function Form(): ReactElement {
    const router = useRouter();
    const { user, setUser } = useContext(UserContext);

    const surveyJson = {
        checkErrorsMode: "onComplete",
        showCompletedPage: false,
        title: "Login",
        questions: [
        {
            name: "email",
            type: "text",
            title: "E-mail address",
            inputType: "email",
            placeholder: "example@email.com",
            autocomplete: "email",
            isRequired: true,
            requiredErrorText: "Email is required",
            validators: [
            { type: "email", text: "Please enter a valid email"}
            ]
        },
        {
            name: "password",
            title: "Enter your password: ",
            type: "text",
            isRequired: true,
            requiredErrorText: "Password is required",
            inputType: "password",
            AutoComplete: "password"
        }],
        showQuestionNumbers: false
    };

    const survey = new Model(surveyJson);
    survey.applyTheme(PlainLight);

    survey.addNavigationItem({
        id: "sign-up-button",
        title: "Sign Up",
        action: (() => router.push('/sign-up'))
    });

    survey.addNavigationItem({
        id: "forgot-password",
        title: "Forgot Password",
        action: (() => router.push('/forgot-password'))
    })

    survey.addNavigationItem({
        id: "sign-in with Google",
        title: "Sign in with Google",
        action: (() => {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({
                prompt: 'select_account',
                display: 'popup'
            });
            signInWithPopup(auth, provider)
            .then(async (result) => {
                console.log('result', result);
                const credential = GoogleAuthProvider.credentialFromResult(result);
                if (!credential) {
                    console.log('Error signing in with Google: no credential');
                    return;
                }
                const authUser = result.user;

                //create user in database if needed
                const userRef = ref(database, `users`);
                const userQuery = query(userRef, orderByValue(),  equalTo(authUser.uid));
                const snapshot = await get(userQuery);

                console.log('snapshot', snapshot);

                if (!snapshot.exists() && authUser.email) {
                    console.log('creating new user in database', authUser.email);
                    await createNewUser(authUser.uid, authUser.displayName ? authUser.displayName : authUser.email, authUser.email, null); //set email to username, no password
                } 

                const userBooksRef = ref(database, `usersBooks/${authUser.uid}`);
                onValue(userBooksRef, async (userBooksSnapshot) => { //listens for realtime updates
                    const books = await loadBooks(userBooksSnapshot);
                    const updatedUser: User = {
                        user_id: authUser.uid,
                        books
                };
                console.log('updated user', updatedUser);
                setUser(updatedUser);
                router.push(`/dashboard/${updatedUser.user_id}`);
                return;
            });
                
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.log('Error signing in with Google: ', error);
        });
    })});

    async function validateEmailandPassword(survey: any, { data, errors, complete }: { data: any, errors: any, complete: Function}) {
        const email = data['email'];
        const password = data['password'];

        if (!email || !password) {
            complete();
            return;
        }
        const userObj = await getUserByEmail(email);
        if (!userObj) {
            errors['email'] = 'Email not found';
            complete();
            return;
        }

        if (!userObj.password) {
            errors['email'] = 'User signed in with Google. Please sign in with Google.';
            complete();
            return;
        }

        if (await compare(password, userObj.password)) {
            //console.log('correct password');

            const userBooksRef = ref(database, `usersBooks/${userObj.id}`);
            onValue(userBooksRef, async (userBooksSnapshot) => { //listens for realtime updata
                const books = await loadBooks(userBooksSnapshot);
                const updatedUser: User = {
                    user_id: userObj.id,
                    books
                };
                //console.log('updated user', updatedUser);
                setUser(updatedUser);
            });

            //sign in user for auth
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                complete();
                router.push(`/dashboard/${userObj.id}`)
                return;
            })
            .catch((error) => {
                console.error('Error signing in user for auth: ', error);
                errors['email'] = 'Error signing in user';
                complete();
                return;
            });

        } else {
            errors['password'] = 'Incorrect password';
            setUser(null);
            complete();
            return;
        }
    }

    survey.onServerValidateQuestions.add(validateEmailandPassword);

    survey.onComplete.add((result) => {
        survey.clear(true, true);
    });


  return <Survey model={survey} />;
}