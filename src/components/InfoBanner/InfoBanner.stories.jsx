/*
 * This short docstring only applies to components that
 * have imports using aliases such as '@components'.
 *
 * There are two ways to import the component:
 * 1. Recommended way:
 *   import { InfoBanner } from '@components';
 * 2. Default import:
 *   import InfoBanner from '@components/InfoBanner/InfoBanner';
 *
 *   NOTE: THIS WON'T WORK => `import InfoBanner from './InfoBanner';`
 *   DON'T ASK WHY AND YOU WILL LIVE HAPPILY :)
 * */

// import InfoBanner from '@components/InfoBanner/InfoBanner';
import { InfoBanner } from '@components';

export default {
    title: 'LCS Website 2023/Components/InfoBanner',
    component: InfoBanner,
};

export const Default = () => {
    return <InfoBanner />;
};
