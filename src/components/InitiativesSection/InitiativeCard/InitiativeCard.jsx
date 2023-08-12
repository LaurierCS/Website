import { useEffect, useState } from 'react';
import { Box, Title, Text, Flex } from '@mantine/core';
import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';
import classes from './InitiativeCard.module.css';

const InitiativeCard = ({
    title = '',
    description = '',
    partnerLogos = [],
    logo = '',
    logoLabel = '',
    right = false,
    children,
}) => {
    const [expanded, setExpanded] = useState(false);
    const [initialMount, setInitialMount] = useState(true);
    const [firstBoxStyles, setFirstBoxStyles] = useState({
        padding: '2rem',
        borderRadius: '19px',
        backgroundColor: '#2C3844',
        width: '100%',
    });

    useEffect(() => {
        if (initialMount) {
            setInitialMount(false);
            return;
        }

        if (expanded) {
            setFirstBoxStyles((prev) => ({
                ...prev,
                borderRadius: '19px 19px 0 0',
            }));
        } else {
            setTimeout(
                () =>
                    setFirstBoxStyles((prev) => ({
                        ...prev,
                        borderRadius: '19px',
                    })),
                500
            );
        }
    }, [expanded]);

    return (
        <Box
            sx={{
                position: 'relative',
                zIndex: 3,
            }}
        >
            <Box sx={firstBoxStyles}>
                <Box
                    sx={{
                        position: 'relative',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '12px',
                            position: 'absolute',
                            right: right ? '0' : undefined,
                        }}
                    >
                        {partnerLogos.map((_logo) => (
                            <img
                                key={_logo.label}
                                alt={_logo.label}
                                src={_logo.url}
                                style={_logo.style}
                            />
                        ))}
                    </Box>
                    <Box>
                        <Title className={classes.title}>{title}</Title>
                    </Box>
                </Box>
                <Flex gap={32} direction={right ? 'row-reverse' : 'row'}>
                    <Flex align="center">
                        <Text
                            as="p"
                            sx={{
                                fontSize: 25,
                                color: '#E7EBF5',
                                textAlign: right ? 'left' : 'right',
                            }}
                        >
                            {description}
                        </Text>
                    </Flex>
                    {logo && (
                        <Box>
                            <img
                                src={logo}
                                alt={logoLabel}
                                className={classes.logo}
                            />
                        </Box>
                    )}
                </Flex>
                <Flex
                    justify="center"
                    align="center"
                    sx={{ marginTop: '2rem' }}
                >
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className={classes.expandButton}
                    >
                        {expanded ? 'Show Less' : 'Show More'}
                        {expanded ? <IconChevronUp /> : <IconChevronDown />}
                    </button>
                </Flex>
            </Box>
            <Box
                sx={{
                    maxHeight: expanded ? '1000px' : 0,
                    transition: 'max-height 0.5s ease',
                    transitionDelay: expanded ? 0 : '0.01s',
                    overflow: 'hidden',
                    borderBottomLeftRadius: '19px',
                    borderBottomRightRadius: '19px',
                }}
            >
                <Box
                    sx={(theme) => ({
                        position: 'relative',
                        zIndex: 2,
                        '::before': {
                            content: '""',
                            position: 'absolute',
                            background: theme.fn.gradient({
                                from: 'blue.4',
                                to: 'accents.1',
                            }),
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: '100%',
                            zIndex: -1,
                            opacity: 0.5,
                        },
                    })}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default InitiativeCard;
