import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// import { useHash } from '../hooks/useQuery'
import { useLocation } from 'react-router-dom';

function useHash() {
    return new URLSearchParams(useLocation().hash);
}

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
                <Box sx={{ p: 3 }}>
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
    const hash = useHash();
    const [hashStr, setHash] = React.useState({
        smartTab: hash.get('smartTab') || 0,
    });

    const handleChange = (event, newValue) => {
        setHash({ smartTab: newValue });
        history.pushState(null, null, `#${newValue}`)
        console.log(hash, hashStr);
    };

    if (props._tabs && !Array.isArray(props._tabs)) {
        console.log('BasicTabs.props._tabs:', props._tabs);
        throw Error('Prop _tabs must be an Array[] on BasicTabs');
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={hashStr.smartTab} onChange={handleChange} aria-label="basic tabs example">
                    {props.tabs.map((_tab, i) => {
                        return (
                            <Tab label={_tab.label} disabled={_tab.disabled} {...a11yProps(i)} />
                        )
                    })}
                </Tabs>
            </Box>
            {props.tabs.map((_tab, i) => {
                return (
                    <TabPanel value={hashStr.smartTab} index={i}>
                        {_tab.component}
                    </TabPanel>
                )
            })}
        </Box>
    );
}
