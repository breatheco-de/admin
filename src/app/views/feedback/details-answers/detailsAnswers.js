import React, { useState, useEffect } from "react";
import {
    Grid,
    Card,
    Avatar,
    IconButton,
    Divider,
    Button,
    LinearProgress,
    Icon,
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@material-ui/core";
import { Twitter } from "@material-ui/icons";
import { Breadcrumb, FacebookIcon, GoogleIcon } from "matx";
import axios from "../../../../axios";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

// const useStyles = makeStyles(({ palette, ...theme }) => ({
//   google: {
//     color: "#ec412c",
//     backgroundColor: "rgba(236,65,44,.1)",
//     borderColor: "#ec412c",

//     "&:hover": {
//       background: `#ec412c`,
//       color: "#ffffff",
//     },
//   },
//   facebook: {
//     color: "#3765c9",
//     backgroundColor: "rgba(55,101,201,.1)",
//     borderColor: "#3765c9",

//     "&:hover": {
//       background: `#3765c9`,
//       color: "#ffffff",
//     },
//   },
//   twitter: {
//     color: "#039ff5",
//     backgroundColor: "rgba(3,159,245,.1)",
//     borderColor: "#039ff5",

//     "&:hover": {
//       background: `#039ff5`,
//       color: "#ffffff",
//     },
//   },
// }));

const DetailsAnswers = () => {
    const [isAlive, setIsAlive] = useState(true);
    const [userList, setUserList] = useState([]);
    const [items, setItems] = useState([]);

    //   const classes = useStyles();

    //   useEffect(() => {
    //     Axios.get("/api/user/all").then(({ data }) => {
    //       if (isAlive) setUserList(data);
    //     });
    //     return () => setIsAlive(false);
    //   }, [isAlive]);

    const customerInfo = [
        {
            title: "Phone",
            value: "+1 439 327 546",
        },
        {
            title: "Country",
            value: "USA",
        },
        {
            title: "State/Region",
            value: "New York",
        },
        {
            title: "Address 1",
            value: "Street Tailwood, No. 17",
        },
        {
            title: "Address 2",
            value: "House #19",
        },
    ];

    // let { user } = items.results[dataIndex];

    return (
        <div className="m-sm-30">
            <div className="mb-sm-30">
                <Breadcrumb
                    routeSegments={[
                        { name: "Feedback", path: "/feedback/answers" },
                        { name: "Answers List", path: "/feedback/answers" },
                        { name: "Details Answers" },
                    ]}
                />
            </div>

            <Grid container spacing={3}>
                {/* {userList.map((user, ind) => ( */}
                {/* <Grid key={user.id} item sm={6} xs={12}> */}
                <Grid item lg={4} md={4} xs={12}>
                    <Card className="pt-6" elevation={3}>
                        <div className="flex-column items-center mb-6">
                            <Avatar className="w-84 h-84" src="/assets/images/faces/10.jpg" />
                            <h5 className="mt-4 mb-2">Ben Peterson</h5>
                            <small className="text-muted">CEO, Brack Ltd.</small>
                        </div>

                        <Divider />
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="pl-4">Score</TableCell>
                                    <TableCell>
                                        {/* <div>ui-lib@example.com</div> */}
                                        <small className="px-1 py-2px bg-light-green text-green border-radius-4">
                                            BUENA
                                        </small>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Card>
                </Grid>
                <Grid item lg={8} md={8} xs={12}>
                    <Card className="mb-2" elevation={3}>
                        <div className="p-5 flex flex-wrap justify-between items-center">
                            <div className="flex items-center m-2">
                                {/* <Avatar className="h-48 w-48" src={user.imgUrl} /> */}
                                <div className="ml-4">
                                    {/* <h5 className="m-0">{user.name}</h5> */}
                                    <h5 className="m-0">Titulo de la pregunta?</h5>
                                    <p className="mb-0 mt-2 text-muted font-normal capitalize">
                                        {/* {user.company?.toLowerCase()} */}
                                        Comentarios a respuesta.
                                        
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
                                        molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
                                        numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
                                        optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis
                                        obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam
                                        nihil, eveniet aliquid culpa officia aut!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card className="mb-2" elevation={3}>
                        <div className="p-5 flex flex-wrap justify-between items-center">
                            <div className="flex items-center m-2">
                                {/* <Avatar className="h-48 w-48" src={user.imgUrl} /> */}
                                <div className="ml-4">
                                    {/* <h5 className="m-0">{user.name}</h5> */}
                                    <h5 className="m-0">Titulo de la pregunta?</h5>
                                    <p className="mb-0 mt-2 text-muted font-normal capitalize">
                                        {/* {user.company?.toLowerCase()} */}
                                        Comentarios a respuesta.
                                        
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
                                        molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
                                        numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
                                        optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis
                                        obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam
                                        nihil, eveniet aliquid culpa officia aut!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                    {/* ))} */}
                </Grid>
            </Grid>
        </div >
    );
};

export default DetailsAnswers;