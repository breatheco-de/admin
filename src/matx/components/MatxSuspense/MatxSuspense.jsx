import React, { Suspense, useEffect, useState } from "react";
import { MatxLoading } from "matx";
import axios from "../../../axios"
import LinearProgress from "@material-ui/core/LinearProgress";

const MatxSuspense = props => {
    const [ loading, setLoading ] = useState(false);
    useEffect(() => {
        if(props.loadbar){
            axios.interceptors.request.use(function (config) {
                // spinning start to show
                setLoading(true)
                return config
                }, function (error) {
                return Promise.reject(error);
                });
    
                axios.interceptors.response.use(function (response) {
                // spinning hide
                setLoading(false)
    
                return response;
            }, function (error) {
                return Promise.reject(error);
            });
        }
    },[])

    return <Suspense fallback={<MatxLoading />}>{loading && props.loadbar && <LinearProgress />}{props.children}</Suspense>;
};

export default MatxSuspense;
