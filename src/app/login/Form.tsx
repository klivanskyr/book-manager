import { ReactElement } from "react";
import 'survey-core/defaultV2.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';

import { UserContext, User } from '@/app/types/UserContext';

export default function Form(): ReactElement {
    const surveyJson = {
      title: "Product Feedback Survey",
      questions: [
        {
          type: "rating",
          name: "satisfaction",
          title: "How satisfied are you with the product?",
          minRateDescription: "Not Satisfied",
          maxRateDescription: "Completely satisfied"
        },
        {
          type: "comment",
          name: "suggestions",
          title: "What would you suggest to improve the product?"
        }
      ]
    };
  
    const survey = new Model(surveyJson);

    survey.onComplete.add((result) => {
        console.log("Survey results: ", result.data);
      });
    
    return <Survey model={survey} />;
}