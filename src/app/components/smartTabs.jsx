import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getHashtringParams, setHashstringParams } from '../../utils'

function TabPanel(props) {
    const { children, value, index, ...other } = props;


    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 1 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs(props) {
    
    const [ smartTab, setSmartTab ] = useState();

    const changeTab = (event, newValue) => {
        const { smart_tab, ...rest } = getHashtringParams();
        setSmartTab(newValue)
        setHashstringParams({ smart_tab: parseInt(newValue), ...rest })
    };

    if (props._tabs && !Array.isArray(props._tabs)) {
        console.log('BasicTabs.props._tabs:', props._tabs);
        throw Error('Prop _tabs must be an Array[] on BasicTabs');
    }

    useEffect(() => {
        const { smart_tab, ...rest } = getHashtringParams();
        if(smart_tab) setSmartTab(parseInt(smart_tab));
        else changeTab(null, 0)
    }, [])

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={smartTab} onChange={changeTab} aria-label="basic tabs example">
                    {props.tabs.map((_tab, i) => {
                        return (
                            <Tab label={_tab.label} disabled={_tab.disabled} {...a11yProps(smartTab)} />
                        )
                    })}
                </Tabs>
            </Box>
            {props.tabs.map((_tab, i) => {
                return (
                    <TabPanel value={smartTab} index={i}>
                        {_tab.component}
                    </TabPanel>
                )
            })}
        </Box>
    );
}
