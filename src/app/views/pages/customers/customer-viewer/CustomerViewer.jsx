import React, { useState } from "react";
import { Divider, Tab, Tabs } from "@material-ui/core";
import { Breadcrumb } from "matx";
import CustomerDetails from "./CustomerDetails";
import CustomerInvoice from "./CustomerInvoice";
import CustomerLogs from "./CustomerLogs";

const CustomerViewer = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (e, value) => {
    setTabIndex(value);
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: "Pages", path: "/pages" },
            { name: "View Customer" },
          ]}
        />
      </div>
      <Tabs
        className="mt-4"
        value={tabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
      >
        {tabList.map((item, ind) => (
          <Tab className="capitalize" value={ind} label={item} key={ind} />
        ))}
      </Tabs>
      <Divider className="mb-6" />

      {tabIndex === 0 && <CustomerDetails />}
      {tabIndex === 1 && <CustomerInvoice />}
      {tabIndex === 2 && <CustomerLogs />}
    </div>
  );
};

const tabList = ["Details", "Invoices", "Logs"];

export default CustomerViewer;
