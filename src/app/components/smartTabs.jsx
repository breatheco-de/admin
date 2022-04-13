import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


function TabPanel(props) {
    const { children, value, index, ...other } = props;
    console.log('props : ', props)
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
    const [value, setValue] = React.useState(0);
    console.log(props)
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    if (props._tabs && !Array.isArray(props._tabs)) {
        console.log('BasicTabs.props._tabs:', props._tabs);
        throw Error('Prop _tabs must be an Array[] on BasicTabs');
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    {props.tabs.map((_tab, i) => {
                        return (
                            <Tab label={_tab.label} {...a11yProps(i)} />
                        )
                    })}
                </Tabs>
            </Box>
            {props.tabs.map((_tab, i) => {
                return (
                    <TabPanel value={value} index={i}>
                        {_tab.component}
                    </TabPanel>
                )
            })}
        </Box>
    );
}
