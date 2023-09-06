import React from 'react';
import { Center, SimpleGrid, ActionIcon } from '@mantine/core';
import { AiFillInstagram, AiFillLinkedin } from 'react-icons/ai';
import { FaYoutube, FaDiscord, FaTwitch, FaTwitter } from 'react-icons/fa';

const NavbarSocials = () => {
    return (
        <Center>
            <SimpleGrid cols={5} spacing="xl">
                <a
                    href="https://discord.gg/lauriercs"
                    target="_blank"
                    rel="external noreferrer"
                >
                    <ActionIcon size="md" variant="transparent">
                        <FaDiscord size={100} />
                    </ActionIcon>
                </a>
                <a
                    href="https://www.instagram.com/laurier.cs/"
                    target="_blank"
                    rel="external noreferrer"
                >
                    <ActionIcon size="md" variant="transparent">
                        <AiFillInstagram size={100} />
                    </ActionIcon>
                </a>
                <a
                    href="https://www.linkedin.com/company/lauriercs"
                    target="_blank"
                    rel="external noreferrer"
                >
                    <ActionIcon size="md" variant="transparent">
                        <AiFillLinkedin size={100} />
                    </ActionIcon>
                </a>
                <a
                    href="https://www.youtube.com/channel/UCx5kLv_MO-yhjIIqcCLEMFA"
                    target="_blank"
                    rel="external noreferrer"
                >
                    <ActionIcon size="md" variant="transparent">
                        <FaYoutube size={100} />
                    </ActionIcon>
                </a>
                <a
                    href="https://www.twitch.tv/lauriercs"
                    target="_blank"
                    rel="next noreferrer"
                >
                    <ActionIcon size="md" variant="transparent">
                        <FaTwitch size={20} />
                    </ActionIcon>
                </a>
            </SimpleGrid>
        </Center>
    );
};

export default NavbarSocials;
