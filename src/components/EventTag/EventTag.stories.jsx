import EventTag from './EventTag';

export default {
    title: 'LCS Website 2023/Components/EventTag',
    component: EventTag,
};

export const General = (args) => {
    return <EventTag {...args} />;
};

export const TimeTag = (args) => {
    return <EventTag {...args} />;
};

TimeTag.args = {
    variant: 'primary',
    intent: 'time',
    removeBg: true,
    startTime: '19:00',
    endTime: '20:35',
};

export const PlaceTag = (args) => {
    return <EventTag {...args} />;
};

PlaceTag.args = {
    variant: 'tertiary',
    intent: 'place',
    place: 'BA110',
    online: false,
    removeBg: true,
};

export const DateTag = (args) => {
    return <EventTag {...args} />;
};

DateTag.args = {
    variant: 'primary',
    intent: 'date',
    date: '30/01/23',
};
