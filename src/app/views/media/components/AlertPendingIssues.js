import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import bc from "../../../services/breathecode"
import useAuth from 'app/hooks/useAuth';
import { Alert, AlertTitle } from "@material-ui/lab";
import Button from 'app/components/Button';

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
          const resp = await bc.registry().getAssetErrors({ limit: 10, offset: 0, status: 'ERROR' });
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
            console.log("assetErrors", assetErrors)
            setStatus({ color: "error", message: `There are ${assetErrors?.count | 0} unresolved errors and ${comments?.count | 0} comments to resolve on the assets. `});
        }
        // } else {
        //     setStatus({ color: "error", message: `This academy does not have an alias for its own slug, which means that incoming leads with the location ${user.academy.slug} will not be included in this list. `});
        // }
      }, [comments, assetErrors]);

  return (
    <div className='mb-2'>
      {comments !== null && (
        <Alert severity={status.color} className={`d-flex bg-${status.color}-light p-2`}>
          <AlertTitle className='mt-2'>{status.message}</AlertTitle>
          {assetErrors !== null && assetErrors.count ? (
            <Button
              variant="contained"
              color="error"
              component={Link}
              to='/media/asset_errors?limit=10&offset=0&status=ERROR'
            >
              Review {assetErrors.count | 0} Errors
            </Button>
          ) : ""}
            {comments !== null && comments.count ? (
              <Button
                variant="contained"
                color="error"
                className='mr-2'
                component={Link}
                to='/media/article_comments?limit=10&offset=0&resolved=false'
              >
                Review {comments.count | 0} Comments
              </Button>
            ) : ""}
        </Alert>
      )}
    </div>
  );
}

export default AlertPendingIssues