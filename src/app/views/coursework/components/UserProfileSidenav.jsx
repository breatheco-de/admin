import React, {useEffect, useState} from "react";
import axios from "../../../../axios";
import { Avatar, Button, Card, Grid, Icon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import useAuth from "app/hooks/useAuth";

const usestyles = makeStyles(({ palette, ...theme }) => ({
    sidenav: {
        marginTop: -345,
        paddingTop: 74,
        [theme.breakpoints.down("sm")]: {
            marginTop: -410,
        },
    },
}));

const UserProfileSidenav = ({ user }) => {
    const classes = usestyles();
    const [ cohorts, setCohorts ] = useState();

    console.log("user", user)
    useEffect(() => {
        if(user) axios.get(`${process.env.REACT_APP_API_HOST}/v1/admissions/academy/cohort/user?users=${user.id}`)
            .then(cu => setCohorts(cu.map(cu => cu.cohort)))
    }, [user])

    return (
        <div className={clsx("flex-column items-center", classes.sidenav)}>
            <Avatar className="h-84 w-84 mb-5" src="/assets/images/face-7.jpg" />
            <p className="text-white">{user.first_name}</p>
            <div className="py-3" />
            <div className="flex flex-wrap w-full px-12 mb-11">
                <div className="flex-grow">
                    <p className="uppercase text-light-white mb-1">NPS</p>
                    <h4 className="font-medium text-white">7.5</h4>
                </div>
                {/* <div>
          <p className="uppercase text-light-white mb-1">points</p>
          <h4 className="font-medium text-white">PT 3,000</h4>
        </div> */}
            </div>
            <div className="px-8 pt-2 bg-default">
                <Grid container spacing={3}>
                    {shortcutList.map((item, ind) => (
                        <Grid item key={ind}>
                            <Card className="w-104 h-104 flex items-center justify-center">
                                <div className="text-muted text-center">
                                    <Icon>{item.icon}</Icon>
                                    <br />
                                    <span className="pt-4">{item.title}</span>
                                </div>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </div>
    );
};

const shortcutList = [
    {
        title: "stars",
        icon: "star_outline",
    },
    {
        title: "events",
        icon: "email",
    },
    {
        title: "Photo",
        icon: "collections",
    },
    {
        title: "settings",
        icon: "brightness_7",
    },
    {
        title: "contacts",
        icon: "group",
    },
];

export default UserProfileSidenav;
