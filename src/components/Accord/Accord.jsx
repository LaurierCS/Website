import React from 'react';
import './Accord.css';
import { Accordion } from '@mantine/core';

const Accord = () => {
     return (
          <div className="Accord">
               <div class = "faq">&lt;Frequently Asked Questions/&gt;</div>
               <Accordion variant="separated" defaultValue="customization">

               <Accordion.Item value="who">
               <Accordion.Control>🐦Who are we?</Accordion.Control>
               <Accordion.Panel>Laurier Computing Society is the official student operated society of Wilfrid Laurier University’s Computer Science department. We strive to help students realise their potential in STEM by enriching their academic and professional development. Our objective is to create initiatives and events to involve students in tech to challenge and improve their skills, and foster a sense of community.</Accordion.Panel>
               </Accordion.Item>

               <Accordion.Item value="where-type">
               <Accordion.Control>⏰ What type of events do you run?</Accordion.Control>
               <Accordion.Panel>We run a wide range of events. We have our signature 'Meet the Professionals' events that let students and professionals connect and get information about the industry. We also run events such as our “Learn a Tool Series”, where we showcase and preview different popular technologies used in the industry that can help students personally, in projects, or in their careers. We also run fun events, such as regular socials, gaming events, and competitions! Stay tuned on our socials to learn more!</Accordion.Panel>
               </Accordion.Item>

               <Accordion.Item value="how">
               <Accordion.Control>🤓 How do I become an official member?</Accordion.Control>
               <Accordion.Panel>You don't have to do anything special! Just attend 2 of our events a term to be considered a part of the club! If you want to be a part of the executive team, feel free to contact any of the executive members for more information!</Accordion.Panel>
               </Accordion.Item>

               <Accordion.Item value="where-do">
               <Accordion.Control>💻 Where do you upload content online?</Accordion.Control>
               <Accordion.Panel>We post our content typically on Twitch as livestreams and post the edited version onto our YouTube page for viewing. This content includes review sessions, workshops, meet the professionals, information on the coop process, and more! We also give updates on events to upcoming events on our Instagram, Discord and other socials. </Accordion.Panel>
               </Accordion.Item>

               <Accordion.Item value="are">
               <Accordion.Control>💰 Are there any giveways currently?</Accordion.Control>
               <Accordion.Panel>We do monthly money gift card giveaways on our socials, so follow us there! Make sure to attend our virtual and in-person events to get a chance to enter giveways or competitions to earn rewards!</Accordion.Panel>
               </Accordion.Item>


               <Accordion.Item value="noidea">
               <Accordion.Control>🗿 What else does LCS do?</Accordion.Control>
               <Accordion.Panel>We host a yearly hackathon called HawkHacks that includes $20k+ in prizes for the winners and has contestants from all over the world. We also host LCS Pods which aims to help student start off their career with a solid project in their portfolio. In addition, we collaborated with the University Of Waterloo's CS Club to help students pair up with mentors and create a project to compete with others for prizes!</Accordion.Panel>
               </Accordion.Item>
               </Accordion>        
          </div>
     );
};

export default Accord;