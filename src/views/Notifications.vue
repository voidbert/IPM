<!--
    Copyright 2025 Ana Oliveira, Humberto Gomes, Inês Marques, Rafael Vilas Boas, Sara Lopes

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
-->

<template>
    <Navbar type="student" />
    <main>
        <h2>Notificações</h2>
        <NotificationsList
            :type="type"
            :notifications="notifications"
            id="notifications"
            @changeRead="updateNotification"
            @changeState="updateNotificationState" />
    </main>
</template>

<style scoped>
main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

#notifications {
    width: 80vw;
}
</style>

<script setup lang="ts">
import Navbar from "../components/Navbar.vue";
import NotificationsList from "../components/NotificationsList.vue";
import { Notification, State } from "../models/Notification.ts";
import { ref } from "vue";

const type: "student" | "director" = "student";

// Example data, change later
const notifications_student: Notification[] = [
    {
        id: 0,
        sender: "Nome",
        content: "Troca de turno PL4 -> PL6",
        date: new Date(),
        read: false
    },
    {
        id: 1,
        sender: "Nome",
        content: "Troca de turno PL4 -> PL6",
        date: new Date(),
        read: false
    },
    {
        id: 2,
        sender: "Nome",
        content: "Troca de turno PL4 -> PL6",
        date: new Date("2025-04-03"),
        read: true
    },
    {
        id: 3,
        sender: "Nome",
        content: "Troca de turno PL4 -> PL6",
        date: new Date("2025-04-03"),
        read: true
    }
];

const notifications_director: Notification[] = [
    {
        id: 4,
        sender: "Nome",
        content: "Troca de turno PL4 -> PL6",
        date: new Date(),
        read: false,
        state: "pending"
    },
    {
        id: 5,
        sender: "Nome",
        content: "Troca de turno PL4 -> PL6",
        date: new Date(),
        read: false,
        state: "pending"
    },
    {
        id: 6,
        sender: "Nome",
        content: "Troca de turno PL4 -> PL6",
        date: new Date("2025-04-03"),
        read: true,
        state: "pending"
    },
    {
        id: 7,
        sender: "Nome",
        content: "Troca de turno PL4 -> PL6",
        date: new Date("2025-04-03"),
        read: true,
        state: "accepted"
    },
    {
        id: 8,
        sender: "Nome",
        content: "Troca de turno PL4 -> PL6",
        date: new Date("2025-04-03"),
        read: false,
        state: "pending"
    },
    {
        id: 9,
        sender: "Nome",
        content: "Troca de turno PL4 -> PL6",
        date: new Date("2025-04-03"),
        read: false,
        state: "pending"
    },
    {
        id: 10,
        sender: "Nome",
        content: "Troca de turno PL4 -> PL6",
        date: new Date("2025-04-03"),
        read: true,
        state: "pending"
    },
    {
        id: 11,
        sender: "Nome",
        content: "Troca de turno PL4 -> PL6",
        date: new Date("2025-04-03"),
        read: true,
        state: "pending"
    }
];

const notifications = ref<Notification[]>(
    {
        student: notifications_student,
        director: notifications_director
    }[type]
);

const updateNotification = (read: boolean, id: number) => {
    const notification = notifications.value.find((e) => e.id == id);
    if (notification) {
        notification.read = read;
    }
};

const updateNotificationState = (state: State, id: number) => {
    const notification = notifications.value.find((e) => e.id == id);
    if (notification) {
        notification.state = state;
    }
};
</script>
