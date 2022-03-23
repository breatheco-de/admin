import React, { useState, useEffect } from "react";
import { Card, Divider } from "@material-ui/core";
import { ResetToken } from "./ResetToken";
import bc from "../../services/breathecode";

const DeveloperTokenCard = () => {

  const [token, setToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const { data } = await bc.auth().getAcademyToken();

        setToken(data)     

      } catch (error) {
        return error;
      }
    };
    getToken();
  }, []);

  const docLink = 'https://documenter.getpostman.com/view/2432393/T1LPC6ef#be79b6fe-7626-4c33-b5f9-4565479852eb';

  return (
    <Card elevation={3}>
      <div className="flex p-4">
        <h4 className="m-0">Academy developer token</h4>
      </div>
      <Divider className="mb-2 flex" />
      <div className="m-3">
        <p>
          Use this academy id or token to interact with the API or retrieve
          students, cohorts and more. You can also use this information for your
          Zappier integrations. 
          <a href={docLink} target="_blank" style={{color:'rgb(17, 82, 147)'}}>
            Click here to read the API documentation
          </a>
        </p>
      </div>
      {token && <ResetToken token={token} />}
    </Card>
  );
};

export default DeveloperTokenCard;
