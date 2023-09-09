import React from 'react';
import './InfoBanner.css';
import { InfoDividerTop, InfoDividerBottom } from '@components';
import { Center } from '@mantine/core';
import CountUp from 'react-countup';

const STUDENT_COUNT = 3500;
const EVENT_COUNT = 20;
const EXECUTIVE_COUNT = 53;

const InfoBanner = () => {
    return (
        <section id="info-banner" style={{ lineHeight: 0 }}>
            <InfoDividerTop />
            <Center
                sx={{
                    background:
                        'linear-gradient(90deg, rgb(108, 179, 255) 0%, rgb(137, 247, 254) 240%)',
                    backgroundColor: '#6CB3FF',
                }}
            >
                <div className="info__banner">
                    <div className="info__banner__text">
                        <p className="info__stats">
                            {<CountUp end={STUDENT_COUNT} duration={1.0} />}+
                        </p>
                        <p className="info__header"> Students </p>
                    </div>
                    <div className="info__banner__text">
                        <p className="info__stats">
                            {<CountUp end={EVENT_COUNT} duration={1.0} />}+
                        </p>
                        <p className="info__header"> Events in the Year </p>
                    </div>
                    <div className="info__banner__text">
                        <p className="info__stats">
                            {<CountUp end={EXECUTIVE_COUNT} duration={1.0} />}
                        </p>
                        <p className="info__header"> Executive Members </p>
                    </div>
                </div>
            </Center>
            <InfoDividerBottom />
        </section>
    );
};

export default InfoBanner;
