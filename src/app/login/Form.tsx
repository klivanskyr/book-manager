'use client';

import { ReactElement, useContext } from "react";
import { useRouter } from 'next/navigation';

import 'survey-core/defaultV2.css';
import { PlainLight } from "survey-core/themes/plain-light";
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';

import { User, UserContext, getUserId, loadBooks } from '@/app/types/UserContext'; 

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
        const id = await getUserId(email);
        if (!id) {
            errors['email'] = 'Email not found';
            complete();
            return;
        }

        const res = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email,
              password: password
            })
        });

        const parsedRes = await res.json();

        if (parsedRes.code != 200) {
            console.log('was not 200, parsedRes.code: ', parsedRes.code)
            errors['password'] = 'Incorrect password';
            setUser(null);
            complete();
            return;
        }

        const books = await loadBooks(id);

        const newUser: User = {
            user_id: id,
            books: books
        }
    
        console.log(user, 'loaded');
        setUser(newUser);
        complete();

        router.push('/dashboard');
        return; 
    }

    survey.onServerValidateQuestions.add(validateEmailandPassword);

    survey.onComplete.add((result) => {
        survey.clear(true, true);
    });


  return <Survey model={survey} />;
}