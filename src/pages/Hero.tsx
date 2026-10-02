/**
 * Hero page
 */

import { Welcome } from '../components/hero/Welcome';
import { Stats } from '../components/hero/Stats';
import HTMLBox from '../components/hero/HTMLBox';

export const HeroPage = () => {
  return (
    <>
      <section className="w-full flex flex-col items-center justify-center overflow-hidden px-4 pt-16 sm:pt-20">
        <Welcome />
        <HTMLBox />
        <Stats />
      </section>
    </>
  );
};

export default HeroPage;
