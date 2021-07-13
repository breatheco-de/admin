import React, { Component } from 'react';
import { Card } from '@material-ui/core';
import { Breadcrumb } from '../../../matx';
// Material-Kit removed for eslint errors
// import SimpleForm from '../material-kit/forms/SimpleForm';

const BasicForm = () => (
  <div className="m-sm-30">
    <div className="mb-sm-30">
      <Breadcrumb routeSegments={[{ name: 'Forms', path: '/forms' }, { name: 'Basic' }]} />
    </div>
    <Card className="px-6 pt-2 pb-4">
      {/* <SimpleForm /> */}
      Marterial-kit Removed for eslint errors
    </Card>
  </div>
);
export default BasicForm;
