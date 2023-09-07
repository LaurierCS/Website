import React from 'react';
import { Center, SimpleGrid, ActionIcon, createStyles } from '@mantine/core';
import { AiFillInstagram, AiFillLinkedin } from 'react-icons/ai';
import { FaYoutube, FaDiscord, FaTwitch } from 'react-icons/fa';


const useStyles = createStyles(() => {
    return {
        socials: {
            '&:hover': {
                transform: 'scale(1.1)'
            }
        },
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
                    <ActionIcon size="md" variant="transparent" className={classes.socials}>
                        <FaDiscord size={100} />
                    </ActionIcon>
                </a>
                <a
                    href="https://www.instagram.com/laurier.cs/"
                    target="_blank"
                    rel="external noreferrer"
                >
                    <ActionIcon size="md" variant="transparent" className={classes.socials}>
                        <AiFillInstagram size={100} />
                    </ActionIcon>
                </a>
                <a
                    href="https://www.linkedin.com/company/lauriercs"
                    target="_blank"
                    rel="external noreferrer"
                >
                    <ActionIcon size="md" variant="transparent" className={classes.socials}>
                        <AiFillLinkedin size={100} />
                    </ActionIcon>
                </a>
                <a
                    href="https://www.youtube.com/channel/UCx5kLv_MO-yhjIIqcCLEMFA"
                    target="_blank"
                    rel="external noreferrer"
                >
                    <ActionIcon size="md" variant="transparent" className={classes.socials}>
                        <FaYoutube size={100} />
                    </ActionIcon>
                </a>
                <a
                    href="https://www.twitch.tv/lauriercs"
                    target="_blank"
                    rel="next noreferrer"
                >
                    <ActionIcon size="md" variant="transparent" className={classes.socials}>
                        <FaTwitch size={20} />
                    </ActionIcon>
                </a>
            </SimpleGrid>
        </Center>
    );
};

export default NavbarSocials;
