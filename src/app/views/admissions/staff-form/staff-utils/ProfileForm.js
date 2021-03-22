import React, { useState } from "react";
import {
    Grid,
    TextField,
} from "@material-ui/core";

export const ProfileForm = ({ handleChange, values }) => {
    return <>
        <Grid item md={1} sm={4} xs={12}>
            Name
                    </Grid>
        <Grid item md={11} sm={8} xs={12}>
            <div className="flex">
                <TextField
                    className="m-2"
                    label="First Name"
                    name="first_name"
                    size="small"
                    required
                    variant="outlined"
                    value={values.first_name}
                    onChange={handleChange}
                />
                <TextField
                    className="m-2"
                    label="Last Name"
                    name="last_name"
                    size="small"
                    required
                    variant="outlined"
                    value={values.last_name}
                    onChange={handleChange}
                />
            </div>
        </Grid>
        <Grid item md={2} sm={4} xs={12}>
            Phone number
                    </Grid>
        <Grid item md={10} sm={8} xs={12}>
            <TextField
                label="Phone number"
                name="phone"
                size="small"
                required
                variant="outlined"
                value={values.phone}
                onChange={handleChange}
            />
        </Grid>
        <Grid item md={2} sm={4} xs={12}>
            Address
                    </Grid>
        <Grid item md={10} sm={8} xs={12}>
            <TextField
                label="Address"
                name="address"
                size="small"
                type="text"
                variant="outlined"
                value={values.address}
                onChange={handleChange}
            />
        </Grid>
        <Grid item md={2} sm={4} xs={12}>
            Email
                    </Grid>
        <Grid item md={10} sm={8} xs={12}>
            <TextField
                label="Email"
                name="email"
                size="small"
                type="email"
                required
                variant="outlined"
                value={values.email}
                onChange={handleChange}
            />
        </Grid>
    </>
}


