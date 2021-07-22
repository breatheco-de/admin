import {
    GET_SURVEY_ANSWERS ,
    GET_SURVEY,
    GET_ANSWERS_BY,
    LOADING
} from '../actions/SurveyActions';

const initialState = {
    answers: [],
    avgCohortScore: 0,
    avgAcademyScore: 0,
    mentors: [],
    answered: [],
    filteredAnswers: [],
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
          isLoading: action.payload.is_loading,
          filteredAnswers: action.payload.answers
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
    case GET_ANSWERS_BY: 
      return {
        ...state,
        filteredAnswers: state.answers.filter(item => {
          if(action.payload.query === 'all') return true;
          if(action.payload.query === 'academy' && !item.cohort && !item.mentor) return true;
          if(action.payload.query === 'cohort' && item.cohort) return true;
          if(action.payload.query !== 'academy' && action.payload.query !== 'cohort' && item.mentor){
            if(action.payload.query === `${item.mentor.first_name} ${item.mentor.last_name}`) return true;
          }
        }),
      }
    default: {
      return {
        ...state
      };
    }
  }
};

export default SurveyReducer;
