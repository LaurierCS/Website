import "./InfoBanner.css";
import { Center } from "@mantine/core";
import CountUp from "react-countup";

const STUDENT_COUNT = 4000;
const EVENT_COUNT = 20;
const EXECUTIVE_COUNT = 44;

const InfoBanner = () => {
    return (
        <section id="info-banner" style={{ lineHeight: 0 }}>
            <Center>
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
        </section>
    );
};

export default InfoBanner;
