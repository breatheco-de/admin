import bc from '../../services/breathecode';

export const GET_SURVEY_ANSWERS = 'GET_SURVEY_ANSWERS';
export const GET_SURVEY = 'GET_SURVEY';

export const getSurveyAnswers = (query) => (distpach) => {
    bc.feedback()
    .getAnswers(query)
    .then(res => {
        let score = 0;
        let answered = [];
        let mentors = {};
        let avg = 0;
        res.data.forEach(item => {
            //Survey overall score
            if(item.score){ 
                score += parseInt(item.score);
                answered.push(item);
            }
            //Passing mentor name and score to mentors object
            if(item.mentor && item.score){
                let mentor = `${item.mentor.first_name} ${item.mentor.last_name}`;
                if(!mentors[mentor]) mentors[mentor] = {};
                if(!mentors[mentor].answered) mentors[mentor].answered = 0;
                if(!mentors[mentor].score) mentors[mentor].score = 0;
                mentors[mentor].score =  mentors[mentor].score + parseInt(item.score);
                mentors[mentor].answered ++;
            }
        });
        let mentorsArray = Object.keys(mentors).map(item =>{ 
            avg += Math.round(mentors[item].score / mentors[item].answered);
            return { name: item, score: Math.round(mentors[item].score / mentors[item].answered) }
        });
        distpach({
        type: GET_SURVEY_ANSWERS,
        payload: {
            answers: res.data,
            avg_cohort_score: Math.round(score/answered.length),
            mentors: mentorsArray,
            answered: answered,
            overall_score: Math.round((Math.round(score/answered.length) + avg) / (mentorsArray.length + 2))
        }
    })
});
};

export const getSurvey = (id) => (distpach) => {
    bc.feedback().getSurvey(id).then(res => {
        if(res.data) distpach({
            type: GET_SURVEY,
            payload: {
                survey: res.data
            }
        });
    });
} 

