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
    <ol class="reset notifications">
        <TransitionGroup name="notification" tag="div" class="notifications-list">
            <NotificationItem
                v-for="n in filteredNotifications"
                :type="props.type"
                :info="n"
                :key="n.id"
                :link="generateLink(n)"
                @changeRead="updateNotification"
                @changeState="changeState" />
        </TransitionGroup>
    </ol>
</template>

<style scoped>
.notifications {
    height: 100%;
    width: 100%;
    border-radius: 0.5rem 0.5rem 0 0;
    padding: 0.5rem;
    background-color: var(--color-notifications-list);
}

.notifications-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem 0;
}

.notification {
    transition: transform 0.3s ease-in-out;
}
</style>

<script setup lang="ts">
import NotificationItem from "./NotificationItem.vue";
import { computed, ref } from "vue";
import { Notification, State } from "../models/Notification.ts";

const filter = ref<"left" | "right">("left");

const props = defineProps<{
    type: "student" | "director";
    notifications: Notification[];
}>();

const emit = defineEmits<{
    (event: "changeRead", read: boolean, id: number): void;
    (event: "changeState", state: State, id: number): void;
}>();

const generateLink = (n: Notification) => {
    if (props.type == "director" && n.state == "pending") {
        return `/SolveProblems/${n.id}`;
    }
    return undefined;
};

const filteredNotifications = computed(() => {
    let notifications = [...props.notifications];
    if (filter.value == "right") {
        notifications = notifications.filter((n) => !n.read);
    } else {
        notifications = notifications;
    }
    notifications.sort((n1, n2) => {
        if (n1.read == false && n2.read == true) {
            return -1;
        } else if (n1.read == true && n2.read == false) {
            return 1;
        } else if (n1.state == "pending" && n2.state != "pending") {
            return -1;
        } else if (n1.state != "pending" && n2.state == "pending") {
            return 1;
        } else if (n1.state != "pending" && n2.state != "pending" && n1.state != n2.state) {
            return n1.state == "accepted" ? -1 : 1;
        } else if (n1.state == n2.state) {
            if (n1.date == n2.date) return n1.id < n2.id ? -1 : 1;
            else return n1.date < n2.date ? 1 : -1;
        } else return n1.id < n2.id ? -1 : 1;
    });
    return notifications;
});

const changeState = (state: State, id: number) => {
    emit("changeState", state, id);
};

const updateNotification = (read: boolean, id: number) => {
    emit("changeRead", read, id);
};
</script>
