import React from "react";
import { Center, Grid, ActionIcon } from "@mantine/core";
import { AiFillInstagram, AiFillLinkedin } from "react-icons/ai";
import { MdEmail } from "react-icons/md";
import { FaDiscord, FaTiktok, FaTwitch } from "react-icons/fa";

const Socials = () => {
    return (
        <Center>
            <Grid grow>
                <Grid.Col span={1}>
                    <a href="https://discord.gg/lauriercs" target="_blank" rel="external noreferrer">
                        <ActionIcon size="xl" variant="transparent" color="#29ABF4">
                            <FaDiscord size={100}/>  
                        </ActionIcon>
                    </a>
                </Grid.Col>

                <Grid.Col span={1}>
                    <a href="mailto:communications@lauriercs.ca" target="_blank" rel="next noreferrer">
                        <ActionIcon size="xl" variant="transparent"  color="#29ABF4">
                            <MdEmail size={100}/>
                        </ActionIcon>
                    </a>
                </Grid.Col>

                <Grid.Col span={1}>
                    <a href="https://www.instagram.com/laurier.cs/" target="_blank" rel="external noreferrer">
                        <ActionIcon size="xl" variant="transparent" color="#29ABF4">
                            <AiFillInstagram size={100}/>  
                        </ActionIcon>
                    </a>
                </Grid.Col>

                <Grid.Col span={1}>
                    <a href="https://www.linkedin.com/company/lauriercs" target="_blank" rel="external noreferrer">
                        <ActionIcon size="xl" variant="transparent" color="#29ABF4">
                            <AiFillLinkedin size={100}/>
                        </ActionIcon>
                    </a>
                </Grid.Col>

                <Grid.Col span={1}>
                    <a href="https://www.twitch.tv/lauriercs" target="_blank" rel="external noreferrer">
                        <ActionIcon size="xl" variant="transparent" color="#29ABF4">
                            <FaTwitch size={35}/>
                        </ActionIcon>
                    </a>
                </Grid.Col>

                <Grid.Col span={1}>
                    <a href="https://www.tiktok.com/@lauriercs" target="_blank" rel="next noreferrer">
                        <ActionIcon size="xl" variant="transparent"  color="#29ABF4">
                            <FaTiktok size={35}/>
                        </ActionIcon>
                    </a>
                </Grid.Col>
            </Grid>
        </Center>
    );
};

export default Socials;