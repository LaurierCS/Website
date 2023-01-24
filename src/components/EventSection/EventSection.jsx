import './EventSection.css';
import React from 'react';

// UI imports from mantine
import { Grid, createStyles } from '@mantine/core';

const EVENT_SECTION_TITLE = '<Upcoming Events />';

// todo: implement classes using mantine
// const useStyles = createStyles((theme) => ({
//     eventSectionTitle: {
//         fontSize: theme.headings.sizes.h5,
//     },
// }));

const EventSection = () => {
    //    const { classes } = useStyles();

    return (
        <Grid grow gutter="lg">
            <Grid.Col span={6}>
                <div>
                    <h1 className="event-side-header">{EVENT_SECTION_TITLE}</h1>
                </div>
            </Grid.Col>
            <Grid.Col span={6}>
                <div className="event-section-table">
                    <div className="event-table">actual table size</div>
                </div>
            </Grid.Col>
        </Grid>
    );
};

export default EventSection;
