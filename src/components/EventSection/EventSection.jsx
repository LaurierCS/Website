import './EventSection.css';
import React from 'react';

// UI imports from mantine
import { Grid, Title, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const EVENT_SECTION_TITLE = '<Upcoming Events />';

// todo: implement classes using mantine
// const useStyles = createStyles((theme) => ({
//     eventSectionTitle: {
//         fontSize: theme.headings.sizes.h5,
//     },
// }));

const EventSection = () => {
    //    const { classes } = useStyles();
    //    TODO: line below looks like shit
    const largeScreen = useMediaQuery('(min-width: 900px)');

    return (
        <Grid grow gutter="lg">
            <Grid.Col span={largeScreen ? 6 : 12}>
                <div className="event-section-text-wrapper">
                    <Title variant="gradient" order={largeScreen ? 1 : 2}>
                        {EVENT_SECTION_TITLE}
                    </Title>
                    <Text align="center" color="white" size="lg">
                        Check out our awesome Events!
                    </Text>
                </div>
            </Grid.Col>
            <Grid.Col span={largeScreen ? 6 : 12}>
                <div className="event-section-table">
                    <div className="event-table">actual table size</div>
                </div>
            </Grid.Col>
        </Grid>
    );
};

export default EventSection;
