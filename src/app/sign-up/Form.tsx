'use client';

import { ReactElement } from "react";
import { useRouter } from 'next/navigation';

import 'survey-core/defaultV2.css';
import { PlainLight } from "survey-core/themes/plain-light";
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';

import { getUserId } from '@/app/types/UserContext'; 
import { AutoComplete } from "antd";

export default function Form({ handleSubmit }: { handleSubmit: Function }): ReactElement {
    const router = useRouter();

    const surveyJson = {
        checkErrorsMode: "onComplete",
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
            name: "password",
            title: "Enter your password: ",
            type: "text",
            isRequired: true,
            requiredErrorText: "Password is required",
            inputType: "password",
            AutoComplete: "password"
        },
        {
            name: "re-enter password",
            title: "Reeneter your password: ",
            type: "text",
            isRequired: true,
            requiredErrorText: "Reentering your password is required",
            inputType: "password",
            AutoComplete: "password"
        }],
        showQuestionNumbers: false
    };

    const survey = new Model(surveyJson);
    survey.applyTheme(PlainLight);

    survey.onComplete.add((result) => {
        handleSubmit(result.data);
        survey.clear(true, true);
    });

    survey.addNavigationItem({
        id: "sign-in-button",
        title: "Sign In",
        action: (() => router.push('/login'))
    });

    async function EmailAlreadyInUse(survey: any, { data, errors, complete }: { data: any, errors: any, complete: Function}) {
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

    survey.onServerValidateQuestions.add(EmailAlreadyInUse);

    survey.onValidateQuestion.add((sender, options) => {
        if (options.name === 'reenter password') {
            if (options.value !== survey.getValue('password')) {
                options.error = 'Passwords do not match';
            }
        }
    });
    
     return <Survey model={survey} />;
}