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
    <main id="notifications-main">
        <h1 id="notifications-title">Notificações</h1>
        <NotificationList
            v-if="notificationType"
            :type="notificationType"
            :notifications="notifications" />
    </main>
</template>

<style scoped>
#notifications-main {
    display: flex;
    flex-direction: column;
    flex: 1 0 0;

    gap: 1em;
    padding: 1em;
}

#notifications-title {
    margin: 0px;
    text-align: center;
    font-size: 1.5rem;
}
</style>

<script setup lang="ts">
import NotificationList from "../components/NotificationList.vue";

import { useLoginStore } from "../stores/login.ts";
import { Notification } from "../models/Notification.ts";
import { User } from "../models/User.ts";

import { ref } from "vue";

const loginStore = useLoginStore();
const notificationType = ref<"student" | "director">();
const notifications = ref<Notification[]>([]);
const maxType = 5;

User.getByEmail(loginStore.email as string).then(async (user) => {
    notificationType.value = (user as User).type as "student" | "director";
    if (notificationType.value != "director") {
        notifications.value = await Notification.getToUser((user as User).id);
    } else {
        let allNotifications: Notification[] = await Notification.getToUser((user as User).id);
        let changeShift = 0;
        allNotifications.forEach((n) => {
            if (n.type === "studentRequest" && n.state === "pending") changeShift += 1;
        });
        if (changeShift > maxType) {
            allNotifications = allNotifications.filter(
                (n) => !(n.type === "studentRequest" && n.state === "pending")
            );
            const notificationGroup = new Notification(
                -1,
                -1,
                (user as User).id,
                new Date(),
                "system",
                "pending"
            );
            notificationGroup.systemMessage = `Tem ${changeShift} pedidos de troca de turno`;
            notificationGroup.systemType = "studentRequest";
            allNotifications.push(notificationGroup);
        }
        notifications.value = allNotifications;
    }
});
</script>
