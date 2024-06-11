'use client';

import { ReactElement } from "react";
import { useRouter } from 'next/navigation';

import 'survey-core/defaultV2.css';
import { PlainLight } from "survey-core/themes/plain-light";
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { FunctionFactory } from "survey-core";

import { getUserId } from '@/app/types/UserContext'; 

export default async function Form({ handleSubmit }: { handleSubmit: Function }): Promise<ReactElement> {
    const router = useRouter();

    const surveyJson = {
        checkErrorsMode: "onComplete",
        showCompletedPage: false,
        title: "Sign Up",
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
            name: "username",
            title: "Username: ",
            type: "text",
            isRequired: true,
            requiredErrorText: "Username is required",
        },
        {
            name: "password",
            title: "Enter your password: ",
            type: "text",
            isRequired: true,
            requiredErrorText: "Password is required",
            inputType: "password",
            AutoComplete: "password"
        },
        // {
        //     name: "re-enter password",
        //     title: "Re-eneter your password: ",
        //     type: "text",
        //     isRequired: true,
        //     requiredErrorText: "Reentering your password is required",
        //     inputType: "password",
        //     AutoComplete: "password"
        // }],
        ],
        showQuestionNumbers: false
    };

    const survey = new Model(surveyJson);
    survey.applyTheme(PlainLight);

    survey.onComplete.add((result) => {
        console.log('\n\nsurvery data: \n', survey);
        if (!survey.hasErrors()){
            handleSubmit(result.data);
            survey.clear(true, true);
        }
    });

    survey.addNavigationItem({
        id: "sign-in-button",
        title: "Sign In",
        action: (() => router.push('/login'))
    });

    async function emailAlreadyInUse(_: any, { data, errors, complete }: { data: any, errors: any, complete: Function}) {
        const email = data['email'];
        if (!email) {
            complete();
            return;
        }
        const id = await getUserId(email);
        if (id) {
            errors['email'] = 'Email already in use. Please sign in or use a different email.';
        }
        complete();
    }
    

    // survey.onValueChanged.add(function (survey, options) {
    //     survey.currentPage.hasErrors(true, false);
    //     survey.currentPage.questions.forEach()
    // })

    survey.onServerValidateQuestions.add(await emailAlreadyInUse);
    // survey.onValidateQuestion.add(passwordsMatch);
    
    return <Survey model={survey} />;
}