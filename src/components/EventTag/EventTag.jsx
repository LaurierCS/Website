import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './EventTag.css';

const IN_DATE_FORMAT = 'DD/MM/YY';
const OUT_DATE_FORMAT = 'MMM. D[th], YYYY';
const IN_TIME_FORMAT = 'H:mm';
const OUT_TIME_FORMAT = 'h:mma';

/*
 * props:
 * variant: "primary" | 'secondary' | 'tertiary' - defaults: 'primary'
 * removeBg: boolean - defaults: false
 * online: boolean - defaults: true
 * place: string - defaults: "TBA"
 * date: string of format "DD/MM/YY" - defaults: "TBA"
 * intent: "time" | "place" | "date" - defaults: 'time'
 * startTime: string of format "HH:MM" - defaults: '19:35'
 * endTime: string of format "HH:MM" - defaults: '20:35'
 * [className]: extra classes to override presets.
 * Note: If the classes are higher in precedence, then override won't happen.
 *
 * All props are optional, but should be defined according to use.
 *
 * Refer to the story of this component to see how everything looks and works.
 * */
const EventTag = ({
    key, // tag id
    variant,
    removeBg,
    online,
    place,
    date,
    intent,
    startTime,
    endTime,
    className,
}) => {
    const time = useMemo(() => {
        // safety check
        const start = moment(startTime, IN_TIME_FORMAT);
        const end = moment(endTime, IN_TIME_FORMAT);

        if (start > end) {
            console.warn(
                'Warning: The startTime time is greater than the endTime time.'
            );
        }

        return {
            start: start.format(OUT_TIME_FORMAT),
            end: end.format(OUT_TIME_FORMAT),
        };
    }, [startTime, endTime]);

    const dateString = useMemo(() => {
        if (date === 'TBA') return date;

        return moment(date, IN_DATE_FORMAT).format(OUT_DATE_FORMAT);
    }, [date]);

    return (
        <div
            className={`event-tag-container ${variant} ${
                removeBg ? '' : 'event-tag-bg'
            } ${className}`}
        >
            {intent === 'time'
                ? `${time.start}-${time.end}`
                : intent === 'place'
                ? `${online ? 'Online' : 'In Person'} | ${place}`
                : dateString}
        </div>
    );
};

EventTag.propTypes = {
    variant: PropTypes.oneOf(['primary', 'secondary', 'tertiary']),
    intent: PropTypes.oneOf(['time', 'place', 'date']),
    removeBg: PropTypes.bool,
    online: PropTypes.bool,
    place: PropTypes.string,
    date: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
};

EventTag.defaultProps = {
    variant: 'primary',
    removeBg: false,
    online: true,
    place: 'TBA',
    date: 'TBA',
    intent: 'time',
    startTime: '0000',
    endTime: '0000',
    className: '',
};

export default EventTag;
