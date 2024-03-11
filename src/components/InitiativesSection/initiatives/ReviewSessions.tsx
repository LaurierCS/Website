import { Title, Text, Box, Flex, Button } from "@mantine/core";
import { FaYoutube, FaTwitch } from "react-icons/fa";
import { IconLogo } from "@/assets";
import { useCommonStyles } from "./styles";

const ReviewSessions = () => {
  const { classes } = useCommonStyles();

  return (
    <Box className={classes.podsContainer}>
      <Box className={classes.outerBox}>
        <Box className={classes.innerBox}>
          <Flex
            justify="center"
            align="center"
            gap={12}
            className={classes.partnerLogoContainer}
          >
            <img alt="LCS Logo" src={IconLogo} className={classes.lcsLogo} />
          </Flex>
          <Title className={classes.title}>Review Sessions</Title>
          <Flex
            justify="center"
            align="center"
            className={classes.headerLogoBox}
          >
            <Box className={classes.headerLogoWrapper}>
              <span className={classes.emojiHeaderLogo}>📝</span>
            </Box>
          </Flex>
        </Box>
        <Flex
          justify="center"
          gap={32}
          className={classes.descriptionContainer}
        >
          <span className={classes.emojiLogo}>📝</span>
          <Box>
            <Flex align="flex-end">
              <Text className={classes.description}>
                Review Sessions are events hosted in-person and/or online by LCS
                which offer fun and interactive way to review course content
                through games of Kahoot and slide shows. Keep an eye on our{" "}
                <span
                  className={classes.link}
                  onClick={(e) => {
                    e.stopPropagation();
                    const eventsSection = document.getElementById("Events");
                    if (eventsSection) {
                      eventsSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  upcoming events
                </span>{" "}
                to not miss out on any Review Session!
              </Text>
            </Flex>
            <Box mt={32}>
              <Flex align="flex-end">
                <Text className={classes.description}>
                  Feel free to take a look at previous Review Sessions and
                  follow us on Twitch for live streams!
                </Text>
              </Flex>
              <Flex justify="flex-end" className={classes.buttonContainer}>
                <Button
                  component="a"
                  variant="subtle"
                  color="red.5"
                  href="https://www.youtube.com/@LaurierComputingSociety/playlists"
                  size="xl"
                  leftIcon={<FaYoutube />}
                  target="_blank"
                  rel="external noreferrer"
                  style={{
                    position: "relative",
                    zIndex: 2,
                    opacity: 0.6,
                    transition: "opacity 0.3s ease-in-out",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
                >
                  Youtube
                </Button>
                <Button
                  component="a"
                  variant="subtle"
                  color="violet.5"
                  href="https://www.twitch.tv/lauriercs"
                  size="xl"
                  leftIcon={<FaTwitch />}
                  target="_blank"
                  rel="external noreferrer"
                  style={{
                    position: "relative",
                    zIndex: 2,
                    opacity: 0.6,
                    transition: "opacity 0.3s ease-in-out",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
                >
                  Twitch
                </Button>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default ReviewSessions;
