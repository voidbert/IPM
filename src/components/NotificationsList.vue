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
            <Notification v-for="n in filteredNotifications" :type=props.type :info=n :key="n.id" @changeRead="updateNotification" />
        </div>
    </div>
</template>

<style scoped>
.notifications {
    height: 100%;
    width: 100%;
    border-radius: 0.5rem 0.5rem 0 0;
    padding: 0.5rem;
    background-color: #ededed;
}

.notifications-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 0.5rem;
    border-bottom: 2px solid #BFBFBF;
    padding: 0 1.5rem 0.5rem 1.5rem;
}

.notifications-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem 0;
}
</style>

<script setup lang="ts">
import Notification from "../components/Notification.vue";
import ToggleButton from "./ToggleButton.vue";
import { computed, ref } from "vue";

const props = defineProps<{
    type: "student" | "director";
    notifications:
        {
            id: number,
            sender: string,
            content: string,
            date: Date,
            read: boolean,
        }[];
}>();
/*
notifications: {
        sender: String,
        content: String,
        date: Date
    }[]
*/

const emit = defineEmits<{
    (event: 'changeRead', read: boolean, id: number): void;
}>();

const filter =ref<"left" | "right">("left");

const updateVisible = (active:"left" | "right") => {
    filter.value = active
}

const filteredNotifications = computed(() => {
    if (filter.value == "right") {
        return props.notifications.filter((n) => !n.read);
    }
    return props.notifications;
});

const updateNotification = (read:boolean, id:number) => {
    let notification = props.notifications.find((e) => e.id == id);
    if (notification) {
        notification.read = read;
        emit('changeRead', read, id);
    }
}
</script>
