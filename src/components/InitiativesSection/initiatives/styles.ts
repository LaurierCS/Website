import { createStyles, MantineTheme } from "@mantine/core";

export const useCommonStyles = createStyles((theme: MantineTheme) => ({
    lcsLogo: {
        width: "4rem",
        marginRight: "0.3rem",
    },

    hhLogo: {
        width: "3rem",
        marginRight: "1rem",
    },

    c3Logo: {
        width: "3rem",
    },

    partnerLogoContainer: {
        position: "absolute",
        left: 0,
        top: 0,

        [theme.fn.smallerThan("md")]: {
            position: "initial",
        },

        [theme.fn.smallerThan("xs")]: {
            gridColumn: "span 2",
        },
    },

    title: {
        fontSize: "3rem",
        color: "#E7EBF5",
        textAlign: "center",
        marginBottom: "2rem",
        [theme.fn.smallerThan("md")]: {
            fontSize: "2.5rem",
        },
        [theme.fn.smallerThan("sm")]: {
            gridColumn: "span 2",
            gridRow: 1,
            fontSize: "2rem",
        },
    },

    outerBox: {
        boxShadow: theme.shadows.lg,
        overflow: "hidden",
        padding: "2rem",
        borderRadius: "19px",
        backgroundColor: "#2C3844",
        width: "100%",
        border: "2px solid #12181B",

        [theme.fn.smallerThan("sm")]: {
            padding: "1rem",
        },
    },

    innerBox: {
        marginBottom: "1rem",
        position: "relative",

        [theme.fn.smallerThan("md")]: {
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
        },

        [theme.fn.smallerThan("sm")]: {
            gridTemplateColumns: "1fr 1fr",
            gap: "0.5rem",
        },
    },

    actionBox: {
        justifyContent: "flex-end",
        paddingRight: "37%",
        marginTop: "2rem",
        gap: theme.spacing.md,

        [theme.fn.smallerThan(400)]: {
            flexDirection: "column",
            alignItems: "center",
        },
    },

    description: {
        fontSize: "1.5rem",
        color: "#E7EBF5",
        textAlign: "right",

        [theme.fn.smallerThan("sm")]: {
            fontSize: "1rem",
        },
    },

    descriptionContainer: {
        gap: 32,
        flexDirection: "row",
        justifyContent: "flex-end",
        [theme.fn.smallerThan("sm")]: {
            gap: 0,
            flexDirection: "column",
        },
    },

    bodyLogo: {
        maxWidth: "34rem",
        margin: "auto",
        display: "block",

        [theme.fn.smallerThan("md")]: {
            display: "none",
        },
    },

    showMoreButton: {
        color: "#E7EBF5",
        width: "fit-content",
    },

    headerLogoBox: {
        height: "10%",
        [theme.fn.smallerThan("xs")]: {
            gridColumn: "span 2",
        },
    },
    emojiLogo: {
        fontSize: "18rem",
        marginRight: "2rem",
        [theme.fn.smallerThan("md")]: {
            display: "none",
        },
    },

    buttonContainer: {
        display: "flex",
        justifyContent: "flex-end",
        position: "relative",
        zIndex: 2,

        "& > button:not(:last-child)": {
            marginRight: theme.spacing.md,
        },
    },

    emojiHeaderLogo: {
        fontSize: "4rem",
        [theme.fn.smallerThan("md")]: {
            fontSize: "3rem",
        },
    },
    headerLogoWrapper: {
        display: "none",
        [theme.fn.smallerThan("md")]: {
            display: "block",
        },
    },

    headerLogo: {
        maxHeight: "2rem",
    },

    hiddenBox: {
        width: "fit-content",
        height: "fit-content",
        visibility: "hidden",
    },

    collapseContent: {
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        color: "white",
        background: "linear-gradient(to right, #4F8FCC, #6ABFC1)",
        borderBottomLeftRadius: theme.radius.lg,
        borderBottomRightRadius: theme.radius.lg,
        marginTop: "-2px",
        marginLeft: "-2px",
        marginRight: "-2px",
        marginBottom: "-2px",
        overflow: "hidden",
    },

    collapseWrapper: {
        "& .mantine-Collapse-root": {
            margin: 0,
            padding: 0,
            border: "none",
            borderRadius: "0",
        },
    },
    podsContainer: {
        boxShadow: theme.shadows.lg,
        overflow: "hidden",
        position: "relative",
        borderRadius: theme.radius.lg,
        "&:before": {
            content: "\"\"",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            opacity: 1,
            transition: "opacity 0.3s ease-in-out",
            zIndex: 1,
        },
        "&:hover:before": {
            opacity: 0,
        },
        "& button": {
            position: "relative",
            zIndex: 2,
            opacity: 0.6,
            transition: "opacity 0.3s ease-in-out",
        },
        "&:hover button": {
            opacity: 1,
        },
        "&.overlay-removed:before": {
            display: "none",
        },
    },
    link: {
        position: "relative",
        zIndex: 2,
        cursor: "pointer",
        color: "rgba(98,193,244, 0.5)",
        "&:hover": {
            color: "#62c1f4",
        },
    },

    collapseContainer: {
        gap: 32,
        flexDirection: "row",
        justifyContent: "flex-end",
        [theme.fn.smallerThan("sm")]: {
            gap: 0,
            flexDirection: "column",
        },
    },

    collapseText: {
        textAlign: "right",
        fontSize: "1.35rem",
        lineHeight: "2",
        marginBottom: "1rem",
        marginLeft: "0rem",
        paddingRight: "5rem",
    },

    collapseParagraph: {
        marginBottom: "2rem",
    },

    bold: {
        fontWeight: "bold",
    },

    collapseLogo: {
        maxWidth: "34rem",
        paddingBottom: "4rem",
        paddingRight: "4rem",
        paddingLeft: "3rem",
    },

    collapseBtnContainer: {
        width: "auto",
        paddingRight: "37%",
    },

    arrowUp: {
        transform: "rotate(180deg)",
    },
}));
