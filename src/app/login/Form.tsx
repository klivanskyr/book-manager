'use client';

import { ReactElement } from "react";
import { useRouter } from 'next/navigation';

import 'survey-core/defaultV2.css';
import { PlainLight } from "survey-core/themes/plain-light";
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';

export default function Form({ handleSubmit }: { handleSubmit: Function }): ReactElement {
  const router = useRouter();

  const surveyJson = {
    checkErrorsMode: "onComplete",
    title: "Login",
    questions: [
      {
        id: "1",
        name: "email",
        title: "Enter your email: ",
        type: "text",
        isRequired: true,
        requiredErrorText: "Email is required",
        validators: [
          { type: "email", text: "Please enter a valid email"}
        ]
      },
      {
        id: "2",
        name: "password",
        title: "Enter your password: ",
        type: "text",
        isRequired: true,
        requiredErrorText: "Password is required",
      }
    ]
  };

  const survey = new Model(surveyJson);
  survey.applyTheme(PlainLight);

  survey.onComplete.add((result) => {
    handleSubmit(result.data);
  });

  survey.addNavigationItem({
    id: "sign-up-button",
    title: "Sign Up",
    action: (() => router.push('/sign-up'))
  });
  
  return <Survey model={survey} />;
}