import {
    Avatar,
    Badge,
    Table,
    Group,
    Text,
    ActionIcon,
    Anchor,
    ScrollArea,
    useMantineTheme,
} from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons';

// Define Functional Component:
const EventsTableitem = ({
    eventTitle,
    eventSchedule: {
        start,
        end,
        date
    },
    description,
    place
}) => {
    return (
        <>
            <tr>
                <td>
                    <Group spacing="sm">
                        <div><Text size="sm" weight={500}>{eventTitle}</Text></div>
                    </Group>
                </td>
                <td>
                    <Text size="sm">{description}</Text>
                </td>
                <td>
                    <Text size="sm">{eventSchedule.date} from {eventSchedule.start} - {eventSchedule.end}</Text>
                    <Text size="xs" color="dimmed">
                        {eventSchedule.place}
                    </Text>
                </td>
                <td>
                    <Group spacing={0} position="right">
                        <ActionIcon>
                            <IconPencil size={16} stroke={1.5} />
                        </ActionIcon>
                        <ActionIcon color="red">
                            <IconTrash size={16} stroke={1.5} />
                        </ActionIcon>
                    </Group>
                </td>
            </tr>
        </>
    )
}

const EditEventsTable = ({ data }) => {
    const rows = data.map((item) => {
        return <EventsTableitem {...item} />
    })

    return (
        <ScrollArea>
            <Table verticalSpacing="sm">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Time & Location</th>
                        <th />
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </ScrollArea>
    )
}

export default EditEventsTable;