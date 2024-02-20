import dayjs from "dayjs";
import bc from "../../services/breathecode";

const duration = require("dayjs/plugin/duration");

dayjs.extend(duration);

export const GET_SURVEY_ANSWERS = "GET_SURVEY_ANSWERS";
export const GET_SURVEY = "GET_SURVEY";
export const LOADING = "LOADING";
export const GET_ANSWERS_BY = "GET_ANSWERS_BY";

export const getSurveyAnswers = (query) => (distpach) => {
    // Loading starts
    distpach({
        type: LOADING,
    });
    bc.feedback()
        .getAnswers(query)
        .then((res) => {
            console.log(res.data);
            let overall_score = 0;
            const academy_score = {};
            const cohort_score = {};
            const answered = [];
            const mentors = {};
            res.data.forEach((item) => {
                // Only Answers
                if (item.score) answered.push(item);
                // Academy overall score
                if (item.score && !item.cohort && !item.mentor) {
                    if (!academy_score.score && !academy_score.divider) {
                        academy_score.score = 0;
                        academy_score.divider = 0;
                    }
                    academy_score.score += parseInt(item.score);
                    academy_score.divider++;
                }
                // Cohort overall score
                if (item.score && !item.mentor && item.cohort) {
                    if (!cohort_score.score && !cohort_score.divider) {
                        cohort_score.score = 0;
                        cohort_score.divider = 0;
                    }
                    cohort_score.score += parseInt(item.score);
                    cohort_score.divider++;
                }
                // Passing mentor name and score to mentors object
                if (item.cohort && item.mentor && item.score) {
                    const mentor = `${item.mentor.first_name} ${item.mentor.last_name}`;
                    if (!mentors[mentor]) mentors[mentor] = {};
                    if (!mentors[mentor].answered) mentors[mentor].answered = 0;
                    if (!mentors[mentor].score) mentors[mentor].score = 0;
                    mentors[mentor].score += parseInt(item.score);
                    mentors[mentor].answered++;
                }
            });
            const mentorsArray = Object.keys(mentors).map((item) => {
                return {
                    name: item,
                    score: mentors[item].score / mentors[item].answered,
                };
            });
            
            let mentorsScore = mentorsArray.reduce((sum, item) => sum + item.score, 0);

            // Setting the sum of all scores
            overall_score =
                cohort_score.score +
                academy_score.score +
                mentorsScore;
            
            
            distpach({
                type: GET_SURVEY_ANSWERS,
                payload: {
                    answers: res.data,
                    avg_cohort_score: (cohort_score.score / cohort_score.divider).toFixed(1),
                    avg_academy_score: (academy_score.score / academy_score.divider).toFixed(1),
                    mentors: mentorsArray,
                    answered,
                    overall_score: (overall_score / (cohort_score.divider + academy_score.divider + mentorsArray.length)).toFixed(1),
                    is_loading: false,
                },
            });
        });
};

export const getSurvey = (id) => (distpach) => {
    const now = dayjs().format();
    bc.feedback()
        .getSurvey(id)
        .then((res) => {
            const duration = dayjs(res.data.sent_at || res.data.created_at).add(
                dayjs(res.data.duration).$D,
                "day"
            );
            if (res.data) {
                distpach({
                    type: GET_SURVEY,
                    payload: {
                        survey: {
                            ...res.data,
                            expired: duration.diff(now, "hour"),
                        },
                    },
                });
            }
        });
};

export const getAnswersBy = (query) => (distpach) => {
    distpach({
        type: GET_ANSWERS_BY,
        payload: {
            query,
        },
    });
};
