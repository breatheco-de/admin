import {
    GET_SURVEY_ANSWERS ,
    GET_SURVEY,
    LOADING
} from '../actions/SurveyActions';

const initialState = {
    answers: [],
    avgCohortScore: 0,
    avgAcademyScore: 0,
    mentors: [],
    answered: [],
    overallScore:0,
    survey: {},
    isLoading: false
};

const SurveyReducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_SURVEY_ANSWERS: {
      return {
          ...state,
          answers: action.payload.answers,
          avgCohortScore: action.payload.avg_cohort_score,
          avgAcademyScore: action.payload.avg_academy_score,
          mentors: action.payload.mentors,
          answered: action.payload.answered,
          overallScore: action.payload.overall_score,
          isLoading: action.payload.is_loading
      }
    }
    case GET_SURVEY: {
        return {
            ...state,
            survey: action.payload.survey
        }
    }
    case LOADING: {
      return {
        ...state,
        isLoading: true
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
