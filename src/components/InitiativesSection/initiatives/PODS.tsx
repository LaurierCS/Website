import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useDisclosure } from "@mantine/hooks";
import { Title, Text, Box, Flex, Button, Collapse } from "@mantine/core";
import {
    PodsLogo,
    IconLogo,
    C3PartnerLogo,
    HHPartnerLogo,
    DownArrowIcon,
    Plant,
} from "@/assets";
import { useCommonStyles } from "./styles";
import dayjs from "@utils/day";
import { store } from "@services/firebase";

const PODS = () => {
    const { classes } = useCommonStyles();

    const [opened, { toggle }] = useDisclosure(false);
    const [data, setData] = useState({
        applicable: false,
        openDate: "TBD",
        description: "",
        typeform: "",
    });

    const getData = async () => {
        try {
            const docSnap = await getDoc(doc(store, "initiatives", "pods"));
            if (docSnap.exists()) {
                const docData = docSnap.data();
                const date = docData.openDate.toDate();
                setData({
                    applicable: docData.applicable,
                    openDate: dayjs(date).format("MMMM Do, YYYY"),
                    description: docData.description,
                    typeform: docData.typeform,
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <Box className={classes.podsContainer}>
            <Box
                className={classes.outerBox}
                style={{
                    borderBottomLeftRadius: opened ? "0px" : "",
                    borderBottomRightRadius: opened ? "0px" : "",
                }}
            >
                <Box className={classes.innerBox}>
                    <Flex
                        justify="center"
                        align="center"
                        gap={12}
                        className={classes.partnerLogoContainer}
                    >
                        <img alt="LCS Logo" src={IconLogo} className={classes.lcsLogo} />
                        <img
                            alt="HawkHacks Logo"
                            src={HHPartnerLogo}
                            className={classes.hhLogo}
                        />
                        <img
                            alt="C Cubed Logo"
                            src={C3PartnerLogo}
                            className={classes.c3Logo}
                        />
                    </Flex>
                    <Title className={classes.title} style={{ marginBottom: "2rem" }}>
            LCS PODS
                    </Title>
                    <Flex
                        justify="center"
                        align="center"
                        className={classes.headerLogoBox}
                    >
                        <Box className={classes.headerLogoWrapper}>
                            <img
                                src={PodsLogo}
                                alt="PODS Logo"
                                className={classes.headerLogo}
                            />
                        </Box>
                    </Flex>
                </Box>
                <Flex className={classes.descriptionContainer}>
                    <Flex align="center" justify="flex-end">
                        <Text
                            className={classes.description}
                            style={{ textAlign: "right" }}
                        >
                            {data.description}
                        </Text>
                    </Flex>
                    <Flex align="center" justify="flex-end">
                        <img
                            src={PodsLogo}
                            alt="PODS Logo"
                            className={classes.bodyLogo}
                            style={{ width: "26rem", height: "auto", marginLeft: "1.6rem" }}
                        />
                    </Flex>
                </Flex>
                <Flex className={classes.actionBox}>
                    {!opened ? (
                        <>
                            <span className="sr-only" id="pods-details">
                opens a dropdown with more description about PODS
                            </span>
                            <Button
                                aria-describedby="pods-details"
                                size="lg"
                                variant="subtle"
                                onClick={toggle}
                                rightIcon={<img src={DownArrowIcon} alt="Down arrow" />}
                                className={classes.showMoreButton}
                            >
                Show More
                            </Button>
                        </>
                    ) : (
                        <Box className={classes.hiddenBox}>
                            <Button
                                size="lg"
                                variant="subtle"
                                rightIcon={<img src={DownArrowIcon} alt="Down arrow" />}
                                className={classes.showMoreButton}
                            >
                Show More
                            </Button>
                        </Box>
                    )}
                </Flex>
            </Box>
            <Collapse in={opened} className={classes.collapseWrapper}>
                <Box className={classes.collapseContent}>
                    <Flex className={classes.collapseContainer}>
                        <Flex align="center" justify="flex-end">
                            <Box className={classes.collapseText}>
                                <p className={classes.collapseParagraph}>
                  PODS has 5 major development phases -{" "}
                                    <span className={classes.bold}>
                    Brainstorming, Design, Prototyping, MVP
                                    </span>{" "}
                  and <span className={classes.bold}>Launch</span>.
                                </p>
                                <p className={classes.collapseParagraph}>
                  PODS teams are curated based on skill level, based on your
                  application&apos;s test. Our goal is for{" "}
                                    <span className={classes.bold}>everyone to learn</span> - not
                  just one hardcarry.
                                </p>
                                <p className={classes.collapseParagraph}>
                  Each POD will work on one project over the course of the next
                  three months. These projects can be{" "}
                                    <span className={classes.bold}>websites</span>,&nbsp;
                                    <span className={classes.bold}>video games</span>,&nbsp;
                                    <span className={classes.bold}>machine learning models</span>
                  ,&nbsp;or whatever else the team is interested in!
                                </p>
                            </Box>
                        </Flex>
                        <Flex align="center" justify="flex-end">
                            <img src={Plant} alt="Plant" className={classes.collapseLogo} />
                        </Flex>
                    </Flex>
                    <Flex justify="flex-end" className={classes.collapseBtnContainer}>
                        <Box>
                            <Button
                                aria-describedby="pods-details"
                                size="lg"
                                variant="subtle"
                                onClick={toggle}
                                rightIcon={
                                    <img
                                        src={DownArrowIcon}
                                        alt="Up arrow"
                                        className={classes.arrowUp}
                                    />
                                }
                                className={classes.showMoreButton}
                            >
                Show Less
                            </Button>
                        </Box>
                    </Flex>
                </Box>
            </Collapse>
        </Box>
    );
};

export default PODS;
