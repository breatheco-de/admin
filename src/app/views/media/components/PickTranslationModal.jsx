import React, { useState } from 'react';
import {
    Dialog,
    Button,
    DialogTitle,
    DialogActions,
    DialogContent,
} from '@material-ui/core';
import Switch from "@material-ui/core/Switch";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import bc from 'app/services/breathecode';

const defaultProps = {
    onClose: null,
    open: true,
  };

export const PickTranslationModal = ({
    asset,
    originalComment,
    onClose,
    open
}) => {
    const [ active, setActive ] = useState({})

    const sendComment = async (_lang) => {
        const resp = await bc.registry().createAssetComment({ 
            ...originalComment, 
            asset: asset.translations[_lang], 
            owner: originalComment.owner?.id, 
            id: undefined 
        })
        if (resp.status == 201) setActive({ [_lang]: resp.data });
    };

    const deleteComment = async (_lang) => {
        const resp = await bc.registry().deleteComment(active[_lang].id)
        if (resp.status == 204) setActive({ [_lang]: false });
      };

    return (
        <Dialog
            open={open}
            onClose={() => onClose(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth="md"
        >
            <DialogContent>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Choose translations to duplicate to:</FormLabel>
                    <FormGroup>
                        {Object.keys(asset.translations).filter(lang => lang != asset.lang).map(lang => {
                            const isActive = active[lang] != undefined && active[lang];
                            return <FormControlLabel
                            control={
                                <Switch
                                checked={isActive}
                                onChange={() => isActive ? deleteComment(lang) : sendComment(lang)}
                                value={lang}
                                />
                            }
                            label={lang}
                            />
                        })}
                    </FormGroup>
                </FormControl>
            </DialogContent>
        </Dialog>
    )
}

PickTranslationModal.defaultProps = defaultProps;