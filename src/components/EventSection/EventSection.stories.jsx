import EventSection from './EventSection';

export default {
    title: 'LCS Website 2023/Components/EventSection',
    component: EventSection,
};

export const Desktop = () => {
    return <EventSection />;
};

export const Mobile = () => {
    return <EventSection />;
};

Mobile.parameters = {
    viewport: {
        defaultViewport: 'mobile2',
    },
};

export const SmallFactorPhone = () => {
    return <EventSection />;
};

SmallFactorPhone.parameters = {
    viewport: {
        defaultViewport: 'mobile1',
    },
};
