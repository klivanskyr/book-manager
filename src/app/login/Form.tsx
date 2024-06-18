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
import { ref, onValue } from 'firebase/database';
import { database } from "@/firebase/firebase";
import { getUserByEmail, updateBooks } from "../db/db";


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

        if (await compare(password, userObj.password)) {
            console.log('correct password');

            const userBooksRef = ref(database, `usersBooks/${userObj.id}`);
            onValue(userBooksRef, async (userBooksSnapshot) => { //listens for realtime updata
                const books = await updateBooks(userBooksSnapshot);
                const updatedUser: User = {
                    user_id: userObj.id,
                    books
                };
                console.log('updated user', updatedUser);
                setUser(updatedUser);
            });

            complete();
            router.push('/dashboard')
            return;

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