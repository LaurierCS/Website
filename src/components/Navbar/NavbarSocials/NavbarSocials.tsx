import React from "react";
import { Center, SimpleGrid, ActionIcon, createStyles } from "@mantine/core";
import { AiFillInstagram, AiFillLinkedin } from "react-icons/ai";
import { FaYoutube, FaDiscord, FaTwitch } from "react-icons/fa";


const useStyles = createStyles(() => {
    return {
        discord: {
            transition: "all 200ms ease-in-out",
            "&:hover": {
                transform: "scale(1.2)",
                color: "#7289da"
            }
        },
        instagram: {
            transition: "all 200ms ease-in-out",
            "&:hover": {
                transform: "scale(1.2)",
                color: "#d62976"
            }
        },
        linkedin: {
            transition: "all 200ms ease-in-out",
            "&:hover": {
                transform: "scale(1.2)",
                color: "#0a66c2"
            }
        },
        youtube: {
            transition: "all 200ms ease-in-out",
            "&:hover": {
                transform: "scale(1.2)",
                color: "#c4302b"
            }
        },
        twitch: {
            transition: "all 200ms ease-in-out",
            "&:hover": {
                transform: "scale(1.2)",
                color: "#6441a5"
            }
        }
    };
});

const NavbarSocials = () => {
    const { classes } = useStyles();
    return (
        <Center>
            <SimpleGrid cols={5} spacing="xl">
                <a
                    href="https://discord.gg/lauriercs"
                    target="_blank"
                    rel="external noreferrer"
                >
                    <ActionIcon size="md" variant="transparent" className={classes.discord}>
                        <FaDiscord size={100} />
                    </ActionIcon>
                </a>
                <a
                    href="https://www.instagram.com/laurier.cs/"
                    target="_blank"
                    rel="external noreferrer"
                >
                    <ActionIcon size="md" variant="transparent" className={classes.instagram}>
                        <AiFillInstagram size={100} />
                    </ActionIcon>
                </a>
                <a
                    href="https://www.linkedin.com/company/lauriercs"
                    target="_blank"
                    rel="external noreferrer"
                >
                    <ActionIcon size="md" variant="transparent" className={classes.linkedin}>
                        <AiFillLinkedin size={100} />
                    </ActionIcon>
                </a>
                <a
                    href="https://www.youtube.com/channel/UCx5kLv_MO-yhjIIqcCLEMFA"
                    target="_blank"
                    rel="external noreferrer"
                >
                    <ActionIcon size="md" variant="transparent" className={classes.youtube}>
                        <FaYoutube size={100} />
                    </ActionIcon>
                </a>
                <a
                    href="https://www.twitch.tv/lauriercs"
                    target="_blank"
                    rel="next noreferrer"
                >
                    <ActionIcon size="md" variant="transparent" className={classes.twitch}>
                        <FaTwitch size={20} />
                    </ActionIcon>
                </a>
            </SimpleGrid>
        </Center>
    );
};

export default NavbarSocials;
