type notification_type = "student" | "director" | "request";

type state = "pending" | "accepted" | "rejected";

type notification = {
    id: number;
    sender: string;
    content: string;
    date: Date;
    read?: boolean;
    state?: state;
};

export { notification, state, notification_type };
