import React from 'react'
import PropTypes from 'prop-types'
import Slider from '@mui/material/Slider';
import duration from 'dayjs/plugin/duration';
import dayjs from 'dayjs';

dayjs.extend(duration);

function valuetext(value) {
    if (value == 1) {
        return `${value} minute`;
    }
    return `${value} minutes`;
}

// TODO Create a function that will turn the minutes into an hour display: arg(number: 160) => "02:00:00"



const MinuteSlider = ({ min, max, step, name, onChange, ariaLabel, defaultValue, marks, }) => {



    return (
        <Slider
            aria-label={ariaLabel}
            onChange={onChange}
            name={name}
            defaultValue={defaultValue}
            getAriaValueText={valuetext}
            step={step}
            min={min}
            max={max}
            marks={marks}
            valueLabelDisplay="on"
        />
    )
}

MinuteSlider.propTypes = {}

export default MinuteSlider