import {
    GET_SURVEY_ANSWERS ,
    GET_SURVEY
} from "../actions/SurveyActions";

const initialState = {
    answers: [],
    avgCohortScore: 0,
    mentors: [],
    answered: [],
    overallScore:0,
    survey: {}
};

const SurveyReducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_SURVEY_ANSWERS: {
      return {
          ...state,
          answers: action.payload.answers,
          avgCohortScore: action.payload.avg_cohort_score,
          mentors: action.payload.mentors,
          answered: action.payload.answered,
          overallScore: action.payload.overall_score
      }
    }
    case GET_SURVEY: {
        return {
            ...state,
            survey: action.payload.survey
        }
    }
    default: {
      return {
        ...state
      };
    }
  }
};

export default SurveyReducer;
