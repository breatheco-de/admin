import React, { useState, useEffect } from "react";
import bc from "app/services/breathecode";
import { ConfirmationDialog } from '../../../../matx';
import {
    Grid,
    Divider,
    Card,
    TextField,
    Icon,
    Button,
    IconButton,
  } from "@material-ui/core";

const defaultOption = { title: "", score: 0, position: null }
const defaultQuestion = { 
    editable: true,
    title: "", 
    options: [
        { ...defaultOption }, 
        { ...defaultOption }
    ]
};

const QuizBuilder = ({asset}) => {

    const getSingle = async () => {
        const assessment = await bc.assessment().getSingle(asset?.assessment?.slug);
        setAssessment(assessment.data)
        return assessment;
    }

    const updateSingle = async (_assessment) => {
        const response = await bc.assessment().updateSingle(asset.assessment.slug, _assessment);
        if(response.status === 200){
            setAssessment(response.data)
            return assessment;
        }
        return false;
    }

    const deleteQuestion = async (_question) => {
        const response = await bc.assessment().deleteQuestion(asset.assessment.slug, _question);
        if(response.status === 204){
            getSingle();
            return true;
        }
        return false;
    }

    useEffect(() => {
        getSingle();
        
    }, [asset.slug])

    const [assessment, setAssessment] = useState(null); 
    const [adding, setAdding] = useState(null); 


    if(!assessment) return <p>Asset assessment not found</p>;

    return <>
        <h2>{assessment.title}</h2>
        {assessment.questions.map(q=> 
            <Question 
                key={q.id} 
                assessment={assessment}
                question={q} 
                onChange={(question => updateSingle({ ...assessment, questions: assessment.questions.map(_q => _q.id == question.id ? question : _q)}))}
                onDelete={question => (question.id && deleteQuestion(question))} 
            />
        )}
        <IconButton size="small" onClick={() => setAssessment({ ...assessment, questions: [ ...assessment.questions, defaultQuestion ]})}>
          <Icon>add</Icon>
        </IconButton>
    </>;
}

const Question = ({ question, onChange, onDelete, assessment }) => {

    const [editable, setEditable] = useState(question.editable || false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [updatedQuestion, setUpdatedQuestion] = useState(question);

    const deleteOption = async (_option) => {
        if(!_option.id) return true;

        const response = await bc.assessment().deleteOption(assessment.slug, _option);
        return response.status === 204;
    }

    return <Card className="p-2 mt-4">
        {editable ? 
            <TextField value={updatedQuestion.title} fullWidth 
                onChange={(e) => setUpdatedQuestion({ 
                    ...updatedQuestion, 
                    title: e.target.value
                })} 
            />
            :
            <label>{updatedQuestion.title}</label>
        }
        {!editable && <IconButton size="small" onClick={() => setEditable(!editable)}>
          <Icon>edit</Icon>
        </IconButton>}
        {!editable && <IconButton size="small" onClick={() => setConfirmDelete(true)}>
          <Icon>delete</Icon>
        </IconButton>}
        <ul className={!editable ? "" : "no-list-style p-0"}>
            {updatedQuestion.options.map((opt, index) => 
                <li key={index}>
                    {editable ? 
                        <div className="flex">
                            <TextField value={opt.title} fullWidth
                                inputProps={{
                                    maxLength: 200
                                }}
                                size="small"
                                variant="outlined"
                                onChange={(e) => setUpdatedQuestion({ 
                                    ...updatedQuestion, 
                                    options: updatedQuestion.options.map((o, _i) => _i == index ? ({ ...o, title: e.target.value }) : o)
                                })} 
                            />
                            <TextField
                                className='m-0'
                                size="small"
                                type="number"
                                variant="outlined"
                                value={opt.score}
                                onChange={(e) => setUpdatedQuestion({ 
                                    ...updatedQuestion, 
                                    options: updatedQuestion.options.map((o, _i) => _i == index ? ({ ...o, score: e.target.value }) : o)
                                })} 
                            />
                            <IconButton size="small" onClick={() => {
                                deleteOption(opt).then(done => setUpdatedQuestion({ ...updatedQuestion, options: updatedQuestion.options.filter((o, _i) => _i != index)}));
                            }}>
                                <Icon>delete</Icon>
                            </IconButton>
                        </div>
                        :
                        opt.title
                    }
                </li>
            )}
            {editable && <IconButton size="small" onClick={() => setUpdatedQuestion({ ...updatedQuestion, options: [ ...updatedQuestion.options, defaultOption ]})}>
                <Icon>add</Icon>
            </IconButton>}
        </ul>
        {editable && <div className="flex">
            <Button style={{ marginLeft: '5px' }} size="small" variant="contained" color="grey" onClick={() => onDelete({}).then(done => setEditable(false))}>Cancel</Button>
            <Button style={{ marginLeft: '5px' }} size="small" variant="contained" color="primary" onClick={() => {
                // const rightAnswers = updatedQuestion.options.filter(o => o.score > 0);
                // if(rightAnswers.length == 0) 
                onChange(updatedQuestion).then(done => done && setEditable(false))
            }}>Save</Button>
        </div>}
        {confirmDelete && <ConfirmationDialog
            open={true}
            onConfirmDialogClose={() => setConfirmDelete(false)}
            title="Confirm"
            onYesClick={() => onDelete(updatedQuestion)}
            >
            <p>Are you sure you want to delete this question?</p>
        </ConfirmationDialog>}
    </Card>
}

export default QuizBuilder;