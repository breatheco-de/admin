import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Typography,
  Icon,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { CopyDialog } from 'app/components/CopyDialog';
import bc from 'app/services/breathecode';
import { toast } from 'react-toastify';

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const PRESET_DELIVERY_FORMATS = [
  'no_delivery',
  'flags',
  'url',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/octet-stream',
  // Common image types
  'image/jpeg',
  'image/png',
  'image/gif',
  // Common archive types
  'application/zip',
  'application/x-rar-compressed',
  // Plain text
  'text/plain',
];

// Helper to compare arrays of strings (order might not matter for formats)
const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  for (let i = 0; i < sortedA.length; ++i) {
    if (sortedA[i] !== sortedB[i]) return false;
  }
  return true;
};

const FlagsCard = ({ asset, onChange }) => {
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [flagsQuantity, setFlagsQuantity] = useState(0);
  const [urlRegex, setUrlRegex] = useState('');

  const [initialFormats, setInitialFormats] = useState([]);
  const [initialFlagsQuantity, setInitialFlagsQuantity] = useState(0);
  const [initialUrlRegex, setInitialUrlRegex] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [generatedFlag, setGeneratedFlag] = useState('');

  const updateDirtyState = useCallback(() => {
    const currentFormats = selectedFormats;
    const currentQuantity = flagsQuantity;
    const currentRegex = urlRegex;

    let dirty = false;
    if (!arraysEqual(currentFormats, initialFormats)) {
      dirty = true;
    }
    // Only check quantity if flags is a relevant format
    if (currentFormats.includes('flags') || initialFormats.includes('flags')) {
        if (currentQuantity !== initialFlagsQuantity) dirty = true;
    }
    // Only check regex if url is a relevant format
    if (currentFormats.includes('url') || initialFormats.includes('url')) {
        if (currentRegex !== initialUrlRegex) dirty = true;
    }
    
    setIsDirty(dirty);
  }, [selectedFormats, flagsQuantity, urlRegex, initialFormats, initialFlagsQuantity, initialUrlRegex]);

  useEffect(() => {
    const deliveryConfig = asset?.config?.delivery;
    let formatsToSet = [];
    let quantityToSet = 0;
    let regexToSet = '';

    if (deliveryConfig && deliveryConfig.formats && Array.isArray(deliveryConfig.formats)) {
      formatsToSet = [...deliveryConfig.formats];
      if (formatsToSet.includes('no_delivery')) formatsToSet = ['no_delivery'];
      else if (formatsToSet.includes('flags')) formatsToSet = ['flags'];
      else if (formatsToSet.includes('url')) formatsToSet = ['url'];
    }

    setSelectedFormats(formatsToSet);
    setInitialFormats(formatsToSet);

    if (formatsToSet.includes('flags') && deliveryConfig) quantityToSet = deliveryConfig.quantity || 0;
    setFlagsQuantity(quantityToSet);
    setInitialFlagsQuantity(quantityToSet);

    if (formatsToSet.includes('url') && deliveryConfig) regexToSet = deliveryConfig.regex || '';
    setUrlRegex(regexToSet);
    setInitialUrlRegex(regexToSet);

    setIsDirty(false); // Reset dirty state when asset changes or on initial load
  }, [asset]);

  useEffect(() => {
    updateDirtyState();
  }, [selectedFormats, flagsQuantity, urlRegex, updateDirtyState]);

  const handleFormatChange = (event, newValue) => {
    let finalSelection = [...newValue];
    if (newValue.includes('no_delivery')) finalSelection = ['no_delivery'];
    else if (newValue.includes('flags')) finalSelection = ['flags'];
    else if (newValue.includes('url')) finalSelection = ['url'];
    setSelectedFormats(finalSelection);
  };

  const handleFlagsQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!Number.isNaN(newQuantity) && newQuantity >= 0) setFlagsQuantity(newQuantity);
  };

  const handleUrlRegexChange = (event) => {
    setUrlRegex(event.target.value);
  };

  const handleSaveChanges = () => {
    const newDeliveryConfig = { formats: selectedFormats };
    if (selectedFormats.includes('flags')) newDeliveryConfig.quantity = flagsQuantity;
    else delete newDeliveryConfig.quantity;
    if (selectedFormats.includes('url')) newDeliveryConfig.regex = urlRegex;
    else delete newDeliveryConfig.regex;

    onChange({ config: { ...asset.config, delivery: newDeliveryConfig } });
    toast.success('Delivery configuration saved!', toastOption);

    // Update initial state to reflect saved changes
    setInitialFormats(selectedFormats);
    setInitialFlagsQuantity(flagsQuantity); // This will be 0 if flags is not selected
    setInitialUrlRegex(urlRegex); // This will be '' if url is not selected
    setIsDirty(false);
  };

  const handleGenerateFlag = async () => {
    if (!asset || !asset.asset_seed) {
      toast.error('Asset seed is not available.', toastOption);
      return;
    }
    try {
      const payload = { asset_seed: asset.asset_seed };
      const resp = await bc.assignment().createAcademyFlag(payload);
      if (resp.status === 200 || resp.status === 201) {
        setGeneratedFlag(resp.data.flag_token || resp.data.token || resp.data.flag || resp.data);
        setIsCopyDialogOpen(true);
        toast.success('Flag generated!', toastOption);
      } else {
        toast.error(resp.data.detail || resp.data.details || 'Failed to generate flag.', toastOption);
      }
    } catch (error) {
      console.error("Error generating flag:", error);
      const errorMsg = error.response?.data?.detail || error.response?.data?.details || 'Error generating flag.';
      toast.error(errorMsg, toastOption);
    }
  };

  const showFlagsConfig = selectedFormats.includes('flags');
  const showUrlConfig = selectedFormats.includes('url');
  // User removed the no_delivery message display, so this variable is not used for rendering
  // const showNoDeliveryMessage = selectedFormats.includes('no_delivery'); 

  return (
    <Card className="p-4 mb-4">
      <Typography variant="h6" gutterBottom className="px-4 pt-4">
        How to deliver?
      </Typography>
      <CardContent>
        <Grid container spacing={3} direction="column">
          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              id="delivery-formats-select"
              options={PRESET_DELIVERY_FORMATS}
              value={selectedFormats}
              onChange={handleFormatChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Delivery Formats"
                  placeholder="e.g., url, flags, application/pdf"
                  helperText="Select format(s). 'no_delivery', 'flags', and 'url' are mutually exclusive."
                />
              )}
            />
          </Grid>

          {/* User removed the no_delivery message display */}

          {showFlagsConfig && (
            <Grid item container spacing={2} alignItems="flex-end" xs={12}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Quantity of flags needed"
                  type="number"
                  value={flagsQuantity}
                  onChange={handleFlagsQuantityChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGenerateFlag}
                  startIcon={<Icon>flag</Icon>}
                  fullWidth
                >
                  Generate New Flag
                </Button>
              </Grid>
            </Grid>
          )}

          {showUrlConfig && (
            <Grid item xs={12}>
              <TextField
                label="URL Regex Validation"
                value={urlRegex}
                onChange={handleUrlRegexChange}
                fullWidth
                variant="outlined"
                size="small"
                placeholder="e.g., https://github.com/.* or https://docs.google.com/.*"
                helperText="Enter a regex to validate the submitted URL. Leave empty for any URL."
              />
            </Grid>
          )}
        </Grid>
      </CardContent>
      {isDirty && (
        <CardActions className="px-4 pb-4">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
          >
            Save Delivery Configuration
          </Button>
        </CardActions>
      )}
      <CopyDialog
        isOpened={isCopyDialogOpen}
        onClose={() => setIsCopyDialogOpen(false)}
        title="Generated Project Flag"
        label="Copy this flag:"
        value={generatedFlag}
      />
    </Card>
  );
};

FlagsCard.propTypes = {
  asset: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FlagsCard;
