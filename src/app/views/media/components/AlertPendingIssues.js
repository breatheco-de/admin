
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import bc from "../../../services/breathecode"
import useAuth from 'app/hooks/useAuth';
import { Alert, AlertTitle } from "@material-ui/lab";

const AlertPendingIssues = () => {
    const [status, setStatus] = useState({ color: "", message: "" });
    const [comments, setComments] = useState(null);
    const { user } = useAuth();


    const getCommnets = async () => {
        try {
          const resp = await bc.registry().getAssetComments({ limit: 10, offset: 0, resolved: false });
          setComments(resp.data);
        } catch (e) {
          console.log(e)
        }
      }

      useEffect(() => {
        getCommnets();
      }, []);

    
      useEffect(() => {
        if (comments && comments.length !== 0) {
            setStatus({ color: "error", message: `There are ${comments.count} unresolved comments on the assets. `});
        }
        // } else {
        //     setStatus({ color: "error", message: `This academy does not have an alias for its own slug, which means that incoming leads with the location ${user.academy.slug} will not be included in this list. `});
        // }
      }, [comments]);


  return (
    <div className='mb-2'>

   {comments !== null && (<Alert severity={status.color}>

      <AlertTitle>{comments !== null
      ?  ( <>{status.message} <Link to='/media/article_issues?limit=10&offset=0&resolved=false' target="_blank"><u>Click here to review them.</u></Link></> )
      : ""}

      </AlertTitle>
      {/* Please paste here your Eventbrite Key to begin the integration */}
    </Alert>)}
  </div>
  )
}

export default AlertPendingIssues