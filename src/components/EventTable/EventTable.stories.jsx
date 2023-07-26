import EventTable from './EventTable';

export default {
    title: 'LCS Website 2023/Components/EventTable',
    component: EventTable,
};

export const Default = () => {
    return <EventTable />;
};

export const NoEvents = () => <EventTable empty={true} />;
