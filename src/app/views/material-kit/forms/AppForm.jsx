import React from 'react';
import { Breadcrumb, SimpleCard } from '../../../../matx';
import SimpleForm from './SimpleForm';
import StepperForm from './StepperForm';

const AppForm = () => (
  <div className="m-sm-30">
    <div className="mb-sm-30">
      <Breadcrumb
        routeSegments={[
          { name: 'Material', path: '/material' },
          { name: 'Form' },
        ]}
      />
    </div>
    <SimpleCard title="Simple Form">
      <SimpleForm />
    </SimpleCard>
    <div className="py-3" />
    <SimpleCard title="stepper form">
      <StepperForm />
    </SimpleCard>
  </div>
);

export default AppForm;
