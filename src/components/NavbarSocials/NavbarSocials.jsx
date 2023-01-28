import React from 'react';
import { Center, Grid, ActionIcon } from '@mantine/core';
import { AiFillInstagram, AiFillLinkedin } from 'react-icons/ai';
import { MdEmail } from 'react-icons/md';
import { FaYoutube,FaDiscord, FaTiktok,FaTwitter, FaTwitch } from 'react-icons/fa';

const NavbarSocials = () => {
    return (
        <Center>
            <Grid grow>
                <Grid.Col span={1}>
                    <a
                        href="https://www.youtube.com/channel/UCx5kLv_MO-yhjIIqcCLEMFA"
                        target="_blank"
                        rel="external noreferrer"
                    >
                        <ActionIcon
                            size="md"
                            variant="transparent"
                        >
                            <FaYoutube size={100} />
                        </ActionIcon>
                    </a>
                </Grid.Col>
                <Grid.Col span={1}>
                    <a
                        href="https://discord.gg/lauriercs"
                        target="_blank"
                        rel="external noreferrer"
                    >
                        <ActionIcon
                            size="md"
                            variant="transparent"
                        >
                            <FaDiscord size={100} />
                        </ActionIcon>
                    </a>
                </Grid.Col>
                <Grid.Col span={1}>
                    <a
                        href="https://twitter.com/lauriercs"
                        target="_blank"
                        rel="next noreferrer"
                    >
                        <ActionIcon
                            size="md"
                            variant="transparent"
                        >
                            <FaTwitter size={100} />
                        </ActionIcon>
                    </a>
                </Grid.Col>

                <Grid.Col span={1}>
                    <a
                        href="https://www.instagram.com/laurier.cs/"
                        target="_blank"
                        rel="external noreferrer"
                    >
                        <ActionIcon
                            size="md"
                            variant="transparent"
                        >
                            <AiFillInstagram size={100} />
                        </ActionIcon>
                    </a>
                </Grid.Col>

                <Grid.Col span={1}>
                    <a
                        href="https://www.linkedin.com/company/lauriercs"
                        target="_blank"
                        rel="external noreferrer"
                    >
                        <ActionIcon
                            size="md"
                            variant="transparent"
                        >
                            <AiFillLinkedin size={100} />
                        </ActionIcon>
                    </a>
                </Grid.Col>


            </Grid>
        </Center>
    );
};

export default NavbarSocials;
