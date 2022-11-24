import React, { useEffect, useState } from 'react'
import bc from "../services/breathecode"
import useAuth from 'app/hooks/useAuth';
import { Alert, AlertTitle } from "@material-ui/lab";

const AlertAcademyAlias = () => {
    const [status, setStatus] = useState({ color: "", message: "" });
    const [alias, setAlias] = useState(null);
    const { user } = useAuth();


    const getAcademyAlias = async () => {
        try {
          const res = await bc.marketing().getAcademyAlias();
          setAlias(res.data);
        } catch (e) {
          console.log(e)
        }
      }

      useEffect(() => {
        getAcademyAlias();
      }, []);

    
      useEffect(() => {
        if (alias && alias.length !== 0) {

            const stringAlias = alias.map(a=> a.slug).join(', ');
            setStatus({ color: "info", message: `Incoming leads are recognized by the following academy aliases: ${stringAlias}. `});
        } else {
            setStatus({ color: "error", message: `This academy does not have an alias for its own slug, which means that incoming leads with the location ${user.academy.slug} will not be included in this list. `});
        }
      }, [alias]);


  return (
    <div className='mb-2'>

   {alias !== null && (<Alert severity={status.color}>

      <AlertTitle>{alias !== null
      ?  ( <>{status.message} <a href='https://4geeksacademy.notion.site/The-academy-alias-8c8e5844e27342e2bd85571e1ff87542' target="_blank"><u>You can read more about it here.</u></a></> )
      : ""}

      </AlertTitle>
      {/* Please paste here your Eventbrite Key to begin the integration */}
    </Alert>)}
  </div>
  )
}

export default AlertAcademyAlias