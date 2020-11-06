import React from "react";
import { Button, Card, Divider, Icon } from "@material-ui/core";
import { GetApp } from "@material-ui/icons";

const CustomerActions = () => {
  return (
    <Card elevation={3}>
      <h5 className="p-4 m-0">Other Actions</h5>

      <Divider className="mb-4" />

      <div className="flex-column items-start px-4 mb-4">
        <Button className="mb-2" variant="text">
          <Icon className="mr-2" fontSize="small">
            not_interested
          </Icon>{" "}
          Close Account
        </Button>
        <Button className="mb-4" variant="text">
          <GetApp className="mr-2" fontSize="small" />
          Export Data
        </Button>

        <div className="flex items-center mb-4">
          <Icon className="mr-2" fontSize="small" color="secondary">
            info
          </Icon>
          <small className="text-muted">
            Once you delete account, data will be lost forever.
          </small>
        </div>

        <Button className="mb-2 bg-error text-white" variant="contained">
          <Icon className="mr-2" fontSize="small">
            delete
          </Icon>{" "}
          Delete Account
        </Button>
      </div>
    </Card>
  );
};

export default CustomerActions;
