// Copyright 2025 Ana Oliveira, Humberto Gomes, Inês Marques, Rafael Vilas Boas, Sara Lopes
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { fetchJson } from "./Utils.ts";

export type NotificationType = "student" | "director" | "request" | "professor";

export type ExchangeType = "shift" | "room" | "none";

export type State = "pending" | "accepted" | "rejected";

export class Notification {
    // Common attributes
    public id: number;
    public to : number;
    public from: number;
    public content: string;
    public date: Date;
    public exchange: ExchangeType;

    // Student and Director only attributes
    public read?: boolean;

    // Director only attributes
    public state?: State;

    constructor(
        to : number,
        from: number,
        content: string,
        date: Date | string,
        read: boolean | undefined = undefined,
        state: State | undefined = undefined,
        exchange: ExchangeType = "none",
        id: number = -1,
    ) {
        this.id = id;
        this.to = to;
        this.from = from;
        this.content = content;
        this.date = typeof date === "string" ? new Date(date) : date;
        this.exchange = exchange;
        if (read !== undefined) {
            this.read = read;
        }
        if (state !== undefined) {
            this.state = state;
        }
    }

    static createFromObject(notificationObject: any): Notification {
        return new Notification(
            notificationObject["to"],
            notificationObject["from"],
            notificationObject["content"],
            notificationObject["date"],
            notificationObject["read"],
            notificationObject["state"],
            notificationObject["exchange"],
            notificationObject["id"]
        );
    }

    static async getUserNotifications(userId: number): Promise<Notification[]> {
        const notifications = (await fetchJson(`/notifications?to=${userId}`)) as any[];
        return notifications.map(notification => Notification.createFromObject(notification));
    }

    static async getUserRequests(userId: number): Promise<Notification[]> {
        const requests = (await fetchJson(`/notifications?from=${userId}`)) as any[];
        const filteredRequests = requests.filter(request => !(request.state === undefined))
        return filteredRequests.map(request => Notification.createFromObject(request));
    }

    static async setNotificationRead(id: number, read: boolean): Promise<Notification> {
        const notification = await fetchJson(`/notifications/${id}`, "PATCH", { read: read });
        return Notification.createFromObject(notification);
    }

    static async setNotificationState(id: number, state: State): Promise<Notification> {
        const notification = await fetchJson(`/notifications/${id}`, "PATCH", { state: state });
        return Notification.createFromObject(notification);
    }

    static async addNotification(
        to: number,
        from: number,
        content: string,
        type: NotificationType
    ): Promise<Notification> {
        const date = new Date();
        let notification: Notification;
        if (type === "student") {
            notification = new Notification(to, from, content, date, false);
        }
        else if (type === "director") {
            notification = new Notification(to, from, content, date, false, "pending");
        }
        else if (type === "request") {
            notification = new Notification(to, from, content, date);
        }
        else {
            throw new Error(`Invalid notification type: ${type}`);
        }
        return await fetchJson(`/notifications`, "POST", notification);
    }
};
