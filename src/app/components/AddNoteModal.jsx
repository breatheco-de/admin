import React from 'react';
import {
  Dialog,
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
  MenuItem,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import bc from '../services/breathecode';

export const AddNoteModal = ({
  newNoteDialog,
  cohortOptions,
  noteFormValues,
  setNewNoteDialog,
  setNoteFormValues,
  stdId,
}) => (
  <>
    <Dialog
      open={newNoteDialog}
      onClose={() => setNewNoteDialog(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth="md"
    >
      <DialogTitle className="ml-2" id="alert-dialog-title">
        Student note
      </DialogTitle>
      <DialogContent>
        <TextField
          className="m-2"
          label="Select note type"
          size="small"
          fullWidth
          variant="outlined"
          value={noteFormValues.noteType}
          onChange={(e) => {
            setNoteFormValues({ ...noteFormValues, slug: e.target.value });
          }}
          select
        >
          {['educational_note', 'career_note'].map((item) => (
            <MenuItem value={item} key={item}>
              {item.toUpperCase().replace('_', ' ')}
            </MenuItem>
          ))}
        </TextField>
        {cohortOptions && (
          <TextField
            className="m-2"
            label="Select a cohort"
            size="small"
            fullWidth
            variant="outlined"
            value={noteFormValues.cohort.name}
            onChange={(e) => {
              const { cohort } = e.target.value;
              setNoteFormValues({ ...noteFormValues, cohort: cohort.slug });
            }}
            select
          >
            {cohortOptions
              && cohortOptions.map((item) => (
                <MenuItem value={item} key={item.cohort.id}>
                  {item.cohort.name}
                </MenuItem>
              ))}
          </TextField>
        )}
        <TextField
          className="m-2"
          label="Type the student note"
          multiline
          row={5}
          fullWidth
          variant="outlined"
          onChange={(e) => {
            const bodyNote = JSON.stringify({ body: e.target.value });
            setNoteFormValues({
              ...noteFormValues,
              data: bodyNote,
            });
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          autoFocus
          onClick={async () => {
            await bc.activity().createStudentActivity(stdId, noteFormValues);
            setNewNoteDialog(false);
          }}
        >
          Add the note to student
        </Button>
      </DialogActions>
    </Dialog>
  </>
);
