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
    <main>
        <h2>Histórico</h2>
        <RequestsList :type="type" :requests="requests" :usersInfo="usersInfo" id="requests" />
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

#requests {
    width: 80vw;
}
</style>

<script setup lang="ts">
import RequestsList from "../components/RequestsList.vue";

import { Notification } from "../models/Notification.ts";
import { User } from "../models/User.ts";

import { useLoginStore } from "../stores/login.ts";

import { ref } from "vue";

const loginStore = useLoginStore();

const requests = ref<Notification[]>([]);
const usersInfo = ref<Record<number, User>>({});
const type = "request";

const fetchRequests = async () => {
    requests.value = await Notification.getUserRequests(loginStore.user.id);
    await fetchUsersInfo();
};

const fetchUsersInfo = async () => {
    const usersIds: number[] = [];
    requests.value.forEach((r) => {
        if (r.to > 0 && !usersIds.includes(r.to)) usersIds.push(r.to);
    });
    usersInfo.value = await User.getUsersPublicInfo(usersIds);
};

fetchRequests();
</script>
