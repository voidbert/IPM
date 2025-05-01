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
    <main id="requests-history-main">
        <NotificationList type="request" :notifications="notifications" />
    </main>
</template>

<style scoped>
#requests-history-main {
    display: flex;
    flex-direction: column;
    flex: 1 0 0;

    gap: 1em;
    padding: 1em;
}
</style>

<script setup lang="ts">
import NotificationList from "../components/NotificationList.vue";

import { useLoginStore } from "../stores/login.ts";
import { Notification } from "../models/Notification.ts";
import { User } from "../models/User.ts";

import { ref } from "vue";

const loginStore = useLoginStore();
const notifications = ref<Notification[]>([]);

User.getByEmail(loginStore.email as string).then(async (user) => {
    notifications.value = await Notification.getFromUser((user as User).id);
});
</script>
