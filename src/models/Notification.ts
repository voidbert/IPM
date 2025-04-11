type Notification_Type = "student" | "director" | "request";

type State = "pending" | "accepted" | "rejected";

type Notification = {
    id: number;
    sender: string;
    content: string;
    date: Date;
    read?: boolean;
    state?: State;
};

export { Notification, State, Notification_Type };
