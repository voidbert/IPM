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
    <div class="requests">
        <Notification v-for="r in sortedRequests" type="request" :info="r" :key="r.id" />
    </div>
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
}
</style>

<script setup lang="ts">
import Notification from "../components/Notification.vue";
import { computed } from "vue";

const props = defineProps<{
    requests: {
        id: number;
        sender: string;
        content: string;
        date: Date;
    }[];
}>();

const sortedRequests = computed(() => {
    const requests = props.requests;
    return requests.sort((r1, r2) => {
        if (r1.date == r2.date) return 0;
        else return r1.date < r2.date ? 1 : -1;
    });
});
</script>
