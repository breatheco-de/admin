import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import bc from "../../../services/breathecode"
import { Alert, AlertTitle } from "@material-ui/lab";
import Button from 'app/components/Button';

const AlertLeadErrors = ({ onClick }) => {
    const [status, setStatus] = useState({ color: "", message: "" });
    const [leadErrors, setleadErrors] = useState(null);

    const getleadErrors = async () => {
        try {
            console.log("fetching lead errors")
        const { data } = await bc.marketing().getAcademyLeads({ limit: 10, offset: 0, storage_status: 'ERROR' });
          setleadErrors(data);
        } catch (e) {
          console.log(e)
        }
      }

      useEffect(() => {
        getleadErrors();
      }, []);

    
      useEffect(() => {
        if (leadErrors && leadErrors.length !== 0){
            setStatus({ color: "error", message: `There are ${leadErrors?.count | 0} unresolved lead errors`});
        }
        // } else {
        //     setStatus({ color: "error", message: `This academy does not have an alias for its own slug, which means that incoming leads with the location ${user.academy.slug} will not be included in this list. `});
        // }
      }, [leadErrors]);

  return (
    <div className='mb-2'>
        {leadErrors !== null && leadErrors.count ? (
        <Alert severity={status.color} className={`d-flex bg-${status.color}-light p-2`}>
          <AlertTitle className='mt-2'>{status.message}</AlertTitle>
            <Button
              variant="contained"
              color="error"
              component={Link}
              onClick={() => onClick({ limit: 10, offset: 0, storage_status: 'ERROR' })}
              to='/growth/leads?limit=10&offset=0&storage_status=ERROR'
            >
              Review {leadErrors.count | 0} Errors
            </Button>
        </Alert>
        ) : ""}
    </div>
  );
}

export default AlertLeadErrors