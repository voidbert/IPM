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
import { useNotificationCirclesStore } from "../stores/notificationCircles.ts";

export type NotificationType =
    | "studentRequest"
    | "professorRequest"
    | "publishedSchedules"
    | "system";
export type NotificationState = "pending" | "accepted" | "rejected";

export class Notification {
    // Common attributes
    id: number;
    from: number;
    to: number;
    date: Date;
    course?: number;
    type: NotificationType;
    state: NotificationState;
    read: boolean;

    // Student request attributes
    fromShift?: number;
    toShift?: number;

    // Professor request attributes
    currentShift?: number;

    // System attributes
    systemType?: NotificationType;
    systemMessage?: string;

    static maxId = 0;

    constructor(
        id: number,
        from: number,
        to: number,
        date: Date,
        type: NotificationType,
        state: NotificationState,
        course: number | undefined = undefined,
        fromShift: number | undefined = undefined,
        toShift: number | undefined = undefined,
        currentShift: number | undefined = undefined,
        read: boolean = false
    ) {
        this.id = id;
        this.to = to;
        this.from = from;
        this.date = date;
        this.type = type;
        this.state = state;
        this.course = course;
        this.fromShift = fromShift;
        this.toShift = toShift;
        this.currentShift = currentShift;
        this.read = read;
    }

    static createFromObject(notificationObject: any): Notification {
        return new Notification(
            Number(notificationObject["id"]),
            notificationObject["from"],
            notificationObject["to"],
            new Date(notificationObject["date"]),
            notificationObject["type"],
            notificationObject["state"],
            notificationObject["course"],
            notificationObject["fromShift"],
            notificationObject["toShift"],
            notificationObject["currentShift"],
            notificationObject["read"]
        );
    }

    async update(): Promise<void> {
        if (!this.read) this.read = true;
        await fetchJson(`/notifications/${this.id}`, "PUT", this);

        const notificationCirclesStore = useNotificationCirclesStore();
        notificationCirclesStore.forceUpdate++;
    }

    async add(): Promise<void> {
        const notifications = await Notification.getAll();
        Notification.maxId =
            Math.max(Notification.maxId, Math.max(...notifications.map((n) => n.id))) + 1;

        const toSend = structuredClone<any>(this);
        toSend.id = String(Notification.maxId + 1);
        await fetchJson(`/notifications/`, "POST", toSend);
    }

    static async getFromUser(userId: number): Promise<Notification[]> {
        const notifications = (await fetchJson(`/notifications?from=${userId}`)) as any[];
        return notifications.map((notification) => Notification.createFromObject(notification));
    }

    static async getToUser(userId: number): Promise<Notification[]> {
        const notifications = (await fetchJson(`/notifications?to=${userId}`)) as any[];
        return notifications.map((notification) => Notification.createFromObject(notification));
    }

    static async getAll(): Promise<Notification[]> {
        return (await fetchJson("/notifications")).map(Notification.createFromObject);
    }
}
