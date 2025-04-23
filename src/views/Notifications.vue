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
    overflow: hidden;
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

const maxType: number = 3;

// Example data, change later
const notifications = ref<Notification[]>([]);

const updateNotification = async (read: boolean, id: number) => {
    const notification = notifications.value.find((e) => e.id == id);
    if (notification) {
        notification.read = read;
    }
    await Notification.setNotificationRead(id, read);
};

const updateNotificationState = async (state: State, id: number) => {
    const notification = notifications.value.find((e) => e.id == id);
    if (notification) {
        notification.state = state;
    }
    await Notification.setNotificationState(id, state);
};

const fetchNotifications = async () => {
    let allNotifications: Notification[] = [];
    if (type == "student") {
        allNotifications = await Notification.getUserNotifications(1);
    }
    else if (type == "director") {
        allNotifications = await Notification.getUserNotifications(2);
        let typeShift = 0;
        let typeRoom = 0;
        allNotifications.forEach(n => {
            if (n.exchange === "shift" && n.state === "pending") typeShift += 1;
            else if (n.exchange === "room" && n.state === "pending") typeRoom += 1;
        });
        if (typeShift > maxType) {
            allNotifications = allNotifications.filter(n => !(n.exchange === "shift" && n.state === "pending"));
            console.log(allNotifications);
            const notificationGroup = new Notification(2, "Sistema", `Tem ${typeShift} pedidos de troca de turno`, new Date(), false, "pending", "shift")
            allNotifications.push(notificationGroup)
        }
        if (typeRoom > maxType) {
            allNotifications = allNotifications.filter(n => !(n.exchange === "room" && n.state === "pending"));
            const notificationGroup = new Notification(2, "Sistema", `Tem ${typeRoom} pedidos de troca de sala`, new Date(), false, "pending", "room")
            allNotifications.push(notificationGroup)
        }
    }
    notifications.value = allNotifications;
};

fetchNotifications();

</script>
