
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import bc from "../../../services/breathecode"
import useAuth from 'app/hooks/useAuth';
import { Alert, AlertTitle } from "@material-ui/lab";
import { Button } from '@material-ui/core';

const AlertPendingIssues = () => {
    const [status, setStatus] = useState({ color: "", message: "" });
    const [comments, setComments] = useState(null);
    const [assetErrors, setAssetErrors] = useState(null);
    const { user } = useAuth();


    const getCommnets = async () => {
        try {
          const resp = await bc.registry().getAssetComments({ limit: 10, offset: 0, resolved: false });
          setComments(resp.data);
        } catch (e) {
          console.log(e)
        }
      }

    const getAssetErrors = async () => {
        try {
          const resp = await bc.registry().getAssetErrors({ limit: 10, offset: 0, resolved: false });
          setAssetErrors(resp.data);
        } catch (e) {
          console.log(e)
        }
      }

      useEffect(() => {
        getCommnets();
        getAssetErrors();
      }, []);

    
      useEffect(() => {
        if ((comments && comments.length !== 0) || (assetErrors && assetErrors.length !== 0)) {
            setStatus({ color: "error", message: `There are ${assetErrors.count | 0} unresolved errors and ${comments.count | 0} comments to resolve on the assets. `});
        }
        // } else {
        //     setStatus({ color: "error", message: `This academy does not have an alias for its own slug, which means that incoming leads with the location ${user.academy.slug} will not be included in this list. `});
        // }
      }, [comments]);


  return (
    <div className='mb-2'>

   {comments !== null && (<div className={`d-flex bg-${status.color}-light p-2`}>

      <p className='mt-2'>{status.message}</p>
      <AlertTitle>{comments !== null
      ?  (  <a className='bg-danger text-white no-decoration d-block' href='/media/article_errors?limit=10&offset=0&resolved=false'><u>Review Errors</u></a>)
      : ""}

      </AlertTitle>
      <AlertTitle>{comments !== null
      ?  (  <a className='bg-danger text-white no-decoration ml-1 d-block' href='/media/article_issues?limit=10&offset=0&resolved=false'><u>Review Assets</u></a> )
      : ""}

      </AlertTitle>
      {/* Please paste here your Eventbrite Key to begin the integration */}
    </div>)}
  </div>
  )
}

export default AlertPendingIssues