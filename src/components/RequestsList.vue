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
    <ol class="reset requests">
        <NotificationItem
            v-for="r in sortedRequests"
            type="request"
            :info="r"
            :name="props.usersInfo[`${r.to}`]?.name ?? 'Sistema'"
            :key="r.id" />
    </ol>
</template>

<style scoped>
.requests {
    height: 100%;
    width: 100%;
    border-radius: 0.5rem 0.5rem 0 0;
    padding: 0.5rem;
    background-color: var(--color-requests-list);
    display: flex;
    flex-direction: column;
    gap: 0.5rem 0;
    overflow-y: auto;
}
</style>

<script setup lang="ts">
import NotificationItem from "./NotificationItem.vue";
import { computed } from "vue";
import { Notification } from "../models/Notification.ts";
import { User } from "../models/User.ts";

const props = defineProps<{
    requests: Notification[];
    usersInfo: Record<number, User>;
}>();

const sortedRequests = computed(() => {
    const requests = [...props.requests];
    return requests.sort((r1, r2) => {
        if (r1.state == "pending" && r2.state != "pending") {
            return -1;
        } else if (r1.state != "pending" && r2.state == "pending") {
            return 1;
        } else if (r1.state != "pending" && r2.state != "pending" && r1.state != r2.state) {
            return r1.state == "accepted" ? -1 : 1;
        } else if (r1.state == r2.state) {
            if (r1.date == r2.date) return r1.id < r2.id ? -1 : 1;
            else return r1.date < r2.date ? 1 : -1;
        } else return r1.id < r2.id ? -1 : 1;
    });
});
</script>
