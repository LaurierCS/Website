interface EventData {
    key: string;
    title: string;
    date: Dayjs;
    place: string;
    visible: boolean;
    active: boolean;
    isNext?: boolean;
    icon?: string;
} 