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
    <ol
        v-if="
            notifications.length > 0 && users.length > 0 && shifts.length > 0 && courses.length > 0
        "
        class="notification-list-container">
        <TransitionGroup name="notification" tag="div" class="notification-list">
            <PresentedNotification
                v-for="notification in shownNotifications"
                :key="notification.notification.id"
                v-bind="notification" />
        </TransitionGroup>
    </ol>
    <div v-else class="notification-list notification-list-no-notifications">
        Sem {{ props.type === "request" ? "pedidos" : "notificações" }} a apresentar
    </div>
</template>

<style scoped>
.notification-list-container {
    list-style-type: none;

    display: flex;
    flex-direction: column;
    flex: 1 0 0;

    border-radius: 0.5em;
    padding: 0.5em;
    margin: 0px;

    background-color: var(--color-notification-list-background);
}

.notification-list {
    display: flex;
    flex-direction: column;
    flex: 1 0 0;

    gap: 0.5em;
    padding: 0.2em 0.5em 0.2em 0.2em;

    overflow-y: scroll;
}

.notification-list-no-notifications {
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

.notification {
    transition: transform 0.3s ease-in-out;
}
</style>

<script setup lang="ts">
import PresentedNotification from "./PresentedNotification.vue";

import { Course } from "../models/Course.ts";
import { Notification } from "../models/Notification.ts";
import { Shift } from "../models/Shift.ts";
import { User } from "../models/User.ts";

import { computed, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";

const props = defineProps<{
    type: "student" | "director" | "request";
    notifications: Notification[];
}>();

const users = ref<User[]>([]);
const shifts = ref<Shift[]>([]);
const courses = ref<Course[]>([]);

Promise.all([User.getAll(), Shift.getAll(), Course.getAll()]).then((res) => {
    users.value = res[0];
    shifts.value = res[1];
    courses.value = res[2];
});

const shownNotifications = computed(() =>
    props.notifications
        .map((notification) => {
            const nameId = props.type === "request" ? notification.to : notification.from;

            return {
                notification: notification,
                nameUser: users.value.find((u) => u.id === nameId) ?? ({} as User),
                course: courses.value.find((c) => c.id === notification.course),
                fromShift: shifts.value.find((s) => s.id === notification.fromShift),
                toShift: shifts.value.find((s) => s.id === notification.toShift),
                currentShift: shifts.value.find((s) => s.id === notification.currentShift),
                type: props.type
            };
        })
        .sort((n1, n2) => {
            const n1State = n1.notification.state !== "pending";
            const n2State = n2.notification.state !== "pending";
            const n1Read = n1.notification.read;
            const n2Read = n2.notification.read;

            if (n1State && !n2State) {
                return 1;
            } else if (!n1State && n2State) {
                return -1;
            } else if (n1Read && !n2Read) {
                return 1;
            } else if (!n1Read && n2Read) {
                return -1;
            } else {
                return n2.notification.date.getTime() - n1.notification.date.getTime();
            }
        })
);

onBeforeRouteLeave(async (_, from) => {
    if (from.path === "/Notifications" && props.type === "student") {
        await Promise.all(
            props.notifications
                .filter((notification) => notification.state === "pending")
                .map((notification) => {
                    notification.state = "accepted";
                    return notification.update();
                })
        );
    }
});
</script>
