import { Title, Text, Box, Flex } from "@mantine/core";
import { IconLogo } from "@/assets";
import { useCommonStyles } from "./styles";

const MTP = () => {
    const { classes } = useCommonStyles();
    const { classes: commonClasses } = useCommonStyles();

    return (
        <Box sx={(theme) => ({ boxShadow: theme.shadows.lg })}>
            <Box className={commonClasses.outerBox}>
                <Box className={commonClasses.innerBox}>
                    <Flex
                        justify="center"
                        align="center"
                        gap={12}
                        className={commonClasses.partnerLogoContainer}
                        sx={(theme) => ({
                            [theme.fn.smallerThan("xs")]: {
                                gridColumn: "span 1",
                            },
                        })}
                    >
                        <img
                            alt="LCS Logo"
                            src={IconLogo}
                            className={classes.lcsLogo}
                        />
                    </Flex>
                    <Title className={commonClasses.title}>
                        Meet The Professionals
                    </Title>
                    <Flex
                        justify="center"
                        align="center"
                        sx={(theme) => ({
                            height: "100%",
                            [theme.fn.smallerThan("xs")]: {
                                gridColumn: "span 1",
                            },
                        })}
                    >
                        <Box
                            sx={(theme) => ({
                                display: "none",
                                [theme.fn.smallerThan("md")]: {
                                    display: "block",
                                },
                            })}
                        >
                            <span className={classes.emojiHeaderLogo}>🧑‍💻</span>
                        </Box>
                    </Flex>
                </Box>
                <Flex justify="center" gap={32}>
                    <span className={classes.emojiLogo}>🧑‍💻</span>
                    <Box sx={{ 
                        paddingX: '1rem',
                        maxWidth: '90%' 
                    }}>
                        <Text className={commonClasses.description}>
                            Join us for an exclusive opportunity to connect with professionals as we bring the coolest guest speakers from the tech industry. Hear from their experiences, learn about their journeys, make meaningful connections, and more!
                        </Text>

                        <Box mt={32}>
                            <Text className={classes.description}>
                                Why should you attend?
                            </Text>
                            <Text className={commonClasses.description} component="ul" mt={8}>
                                <li>Get tips on job searching, interview preparation, and learn how to stand out in the tech industry</li>
                                <li>Open Q&A to address any questions</li>
                                <li>Network one-on-one with experts and expand your connections</li>
                            </Text>
                        </Box>
                    </Box>
                </Flex>
            </Box>
        </Box>
    );
};

export default MTP;