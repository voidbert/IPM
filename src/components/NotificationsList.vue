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
    <div class="notifications">
        <div class="notifications-header">
            <ToggleButton left="Todos" right="Não Lidos" @changeActive="updateVisible" />
        </div>
        <div class="notifications-list">
            <NotificationItem
                v-for="n in filteredNotifications"
                :type="props.type"
                :info="n"
                :key="n.id"
                :link="generateLink(n)"
                @changeRead="updateNotification"
                @changeState="changeState" />
        </div>
    </div>
</template>

<style scoped>
.notifications {
    height: 100%;
    width: 100%;
    border-radius: 0.5rem 0.5rem 0 0;
    padding: 0.5rem;
    background-color: var(--color-notifications-list);
}

.notifications-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 0.5rem;
    border-bottom: 2px solid var(--color-notifications-list-header-border);
    padding: 0 1.5rem 0.5rem 1.5rem;
}

.notifications-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem 0;
}
</style>

<script setup lang="ts">
import NotificationItem from "./NotificationItem.vue";
import ToggleButton from "./ToggleButton.vue";
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

const updateVisible = (active: "left" | "right") => {
    filter.value = active;
};

const filteredNotifications = computed(() => {
    let notifications = [];
    if (filter.value == "right") {
        notifications = props.notifications.filter((n) => !n.read);
    } else {
        notifications = props.notifications;
    }
    notifications.sort((n1, n2) => {
        if (n1.state == "pending" && n2.state != "pending") {
            return -1;
        } else if (n1.state != "pending" && n2.state == "pending") {
            return 1;
        } else if (
            (n1.state == "pending" && n2.state == "pending") ||
            (n1.state != "pending" && n2.state != "pending")
        ) {
            if (n1.date == n2.date) return 0;
            else return n1.date < n2.date ? 1 : -1;
        } else return 0;
    });
    return notifications;
});

const changeState = (state: State, id: number) => {
    emit("changeState", state, id);
};

const updateNotification = (read: boolean, id: number) => {
    const notification = props.notifications.find((e) => e.id == id);
    if (notification) {
        notification.read = read;
        emit("changeRead", read, id);
    }
};
</script>
