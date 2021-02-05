import React, { useState, useEffect } from "react";
import { Icon, IconButton, Hidden, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import { MatxSidenavContainer, MatxSidenav, MatxSidenavContent } from "matx";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import axios from "../../../axios"
import UserProfileContent from "./components/UserProfileContent";
import UserProfileSidenav from "./components/UserProfileSidenav";
import { SmartAutocomplete } from "../../components/SmartAutocomplete";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const usestyles = makeStyles(({ palette, ...theme }) => ({
    headerBG: {
        height: 345,
        "@media only screen and (max-width: 959px)": {
            height: 400,
        },
    },
}));

const UserProfile = () => {
    const [open, setOpen] = useState(true);
    const { std_id } = useParams();
    const history = useHistory();
    const [profile, setProfile] = useState(std_id);
    const theme = useTheme();
    const classes = usestyles();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const toggleSidenav = () => {
        setOpen(!open);
    };

    const getUser = (std_id) => {
            axios.get(`${process.env.REACT_APP_API_HOST}/v1/auth/academy/student/${std_id}`)
                .then(prof => setProfile(prof))
    }

    useEffect(() => {
        if(std_id) getUser(std_id)
    }, []);

    useEffect(() => {
        if (isMobile) setOpen(false);
        else setOpen(true);
    }, [isMobile]);

    if(!profile) return <div>
        <SmartAutocomplete 
            width={"100%"} 
            onChange={(profile)=> {
                setProfile(profile)
                history.push("/coursework/student/"+profile.user.id)
            }} 
            asyncSearch={(searchTerm)=> axios.get(`${process.env.REACT_APP_API_HOST}/v1/auth/academy/student?like=${searchTerm}`)} 
        />
    </div>

    return (
        <div className="relative">
            <MatxSidenavContainer>
                <MatxSidenav width="300px" open={open} toggleSidenav={toggleSidenav}>
                    <div className={clsx("bg-primary text-right", classes.headerBG)}>
                        <Hidden smUp>
                            <IconButton onClick={toggleSidenav}>
                                <Icon className="text-white">clear</Icon>
                            </IconButton>
                        </Hidden>
                    </div>
                    <UserProfileSidenav user={profile} />
                </MatxSidenav>
                <MatxSidenavContent open={open}>
                    <div className={clsx("bg-primary", classes.headerBG)} />
                    <UserProfileContent toggleSidenav={toggleSidenav} />
                </MatxSidenavContent>
            </MatxSidenavContainer>
        </div>
    );
};

export default UserProfile;
