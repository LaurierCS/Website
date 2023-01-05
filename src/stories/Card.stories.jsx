import { Card } from '../components';

export default {
    title: 'Components/Card',
    component: Card,
}

const Template = () => (
    <Card>
        <div>
            <h1>The Benefits of Meditation</h1>
            <p>Meditation has been shown to have numerous benefits for the mind and body. It can reduce stress, improve focus and concentration, and even lower blood pressure. Regular meditation can also lead to a sense of well-being and increased happiness. Give it a try and see the positive effects it can have on your life.</p>
        </div>
    </Card>);

export const SolidCard = Template.bind({});

