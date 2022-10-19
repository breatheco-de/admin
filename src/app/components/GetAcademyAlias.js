import React, { useEffect, useState } from 'react'
import bc from "../../app/services/breathecode"
import useAuth from 'app/hooks/useAuth';
import { Alert, AlertTitle } from "@material-ui/lab";

const GetAcademyAlias = () => {
    const [status, setStatus] = useState({ color: "", message: "" });
    const [alias, setAlias] = useState([]);

    const { user } = useAuth();

    const getAcAcademyAlias = async () => {
        try {
          const res = await bc.marketing().getAcademyAlias();
          console.log(res);
          setAlias(res.data);
        } catch (e) {
          console.log(e)
        }
      }

      useEffect(() => {
        getAcAcademyAlias();
      }, []);

    
      useEffect(() => {
        if (alias.length !== 0) {
            const stringAlias = alias.map(a=> a.slug).join(', ');
            setStatus({ color: "info", message: `Incoming leads are recognized by the following academy aliases: ${stringAlias} `});
        }
        else {
            setStatus({ color: "warning", message: `This academy does not have an alias for its own slug, which means that incoming leads with the location ${user.academy.slug} will not be included in this list, you can read more about it here`});
        }

      }, [alias]);

  return (
    <div className='mb-2'>
    <Alert severity={status.color}>
      <AlertTitle>{status.message}</AlertTitle>
      {/* Please past here you Eventbrite Key to begin the integration */}
    </Alert>
  </div>
  )
}

export default GetAcademyAlias