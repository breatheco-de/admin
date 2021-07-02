import React from 'react';
import { SimpleCard } from '../../../matx';
import HorizontalStepper from './HorizontalStepper';
import VerticalStepper from './VerticalStepper';

const WizardForm = () => (
  <div className="m-sm-30">
    <SimpleCard title="Horizontal Stepper">
      <HorizontalStepper />
    </SimpleCard>
    <div className="py-3" />
    <SimpleCard title="Vertical Stepper">
      <VerticalStepper />
    </SimpleCard>
  </div>
);

export default WizardForm;
