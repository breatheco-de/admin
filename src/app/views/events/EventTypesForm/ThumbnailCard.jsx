import React, { useState, useEffect } from "react";
import {
  Table, TableCell, TableRow, Card, MenuItem, DialogContent,
  Grid, Dialog, TextField, Button, Chip, Icon, Tooltip, TableHead,
  TableBody
} from "@material-ui/core";

import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import bc from 'app/services/breathecode';
import relativeTime from 'dayjs/plugin/relativeTime';
import { MediaInput } from '../../../components/MediaInput';
import config from '../../../../config.js';
import PropTypes from 'prop-types';

dayjs.extend(relativeTime)


toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const eventypePropTypes = {
    id: PropTypes.number,
    slug: PropTypes.string,
    name: PropTypes.string,
    icon_url: PropTypes.string,
    academy_owner: PropTypes.number,
    visibility_settings: PropTypes.string,
  };
  

const propTypes = {
    onSubmit: PropTypes.func.isRequired,
    eventype: PropTypes.shape(eventypePropTypes).isRequired,
  };

const ThumbnailCard = ({ eventype, onChange }) => {
    const [preview, setPreview] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const [edit, setEdit] = useState(null);
  
    useEffect(() => {
      setPreview(eventype?.icon_url)
      setPreviewURL(eventype?.icon_url)
    }, [eventype?.icon_url])
  
    return <Card className="p-4 mb-4">
      {edit ?
        <div className="flex">
          <MediaInput
            size="small"
            placeholder="Image URL"
            value={previewURL}
            handleChange={(k, v) => {setPreviewURL(v); onChange(v)}}
            name="icon_url"
            fullWidth
            inputProps={{ style: { padding: '10px' } }}
          />
          <Button variant="contained" color="primary" size="small" onClick={() => setEdit(false)}>
            <Icon fontSize="small">cancel</Icon>
          </Button>
        </div>
          :
          <p className="m-0">No preview image has been generated for this Event Type.
            <a href="#" className="anchor text-primary underline" onClick={() => setEdit(true)}> Set one now</a>
          </p>
      }
    </Card>;
  }

  ThumbnailCard.propTypes = propTypes;

export default ThumbnailCard;
