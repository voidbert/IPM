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
    <nav class="navbar">
        <ApplicationIcon />
        <NavbarLinks :links="links" />

        <NavbarHoverableIcon
            :url="themeStore.theme === 'light' ? '/dark-mode.svg' : '/light-mode.svg'"
            tooltip="Modo escuro"
            @click="themeStore.change()" />
        <NavbarHoverableIcon
            v-if="props.type !== 'login'"
            url="/notifications.svg"
            tooltip="Notificações"
            :notificationCircle="hasNotificationCircle"
            @click="router.push('/Notifications')" />
        <NavbarHoverableIcon
            v-if="props.type !== 'login'"
            @click="logout()"
            url="/log-out.svg"
            tooltip="Terminar sessão" />
    </nav>
</template>

<style scoped>
.navbar {
    height: 4em;
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 0em 0.5em;

    background-color: var(--color-navbar-background);
}

.navbar-links {
    flex-grow: 1;
}

.navbar-hoverable-icon {
    height: 70%;
}
</style>

<script setup lang="ts">
import ApplicationIcon from "./ApplicationIcon.vue";
import NavbarHoverableIcon from "./NavbarHoverableIcon.vue";
import NavbarLinks from "./NavbarLinks.vue";

import { useThemeStore } from "../stores/theme.ts";
import { useLoginStore } from "../stores/login.ts";
import { useNotificationCirclesStore } from "../stores/notificationCircles.ts";
import { Notification } from "../models/Notification.ts";
import { User } from "../models/User.ts";

import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
    type: "login" | "student" | "director" | "professor";
}>();

// Links
const hasSchedulesCircles = ref(false);
const hasNotificationCircle = ref(false);

const links = computed(() => {
    return {
        login: [],
        student: [
            {
                name: "O meu Horário",
                url: "/MySchedule"
            },
            {
                name: "Horário Completo",
                url: "/CompleteSchedule"
            },
            {
                name: "Histórico de Pedidos",
                url: "/RequestsHistory"
            }
        ],
        director: [
            {
                name: "Resolver Problemas",
                url: "/SolveProblems"
            },
            {
                name: "Gerir Turnos",
                url: "/ManageShifts"
            },
            {
                name: "Publicar Horários",
                url: "/PublishSchedules",
                notificationCircle: hasSchedulesCircles.value
            }
        ],
        professor: []
    }[props.type];
});

// Theme switching
const themeStore = useThemeStore();

// Notification circles
const loginStore = useLoginStore();
const notificationCirclesStore = useNotificationCirclesStore();

const updateNotificationCircles = async () => {
    const users = await User.getAll();
    const user = (await User.getByEmail(loginStore.email as string)) as User;
    const notifications = await Notification.getToUser(user.id);

    hasSchedulesCircles.value = users.some(
        (u) => JSON.stringify(u.committedSchedule) !== JSON.stringify(u.directorSchedule)
    );
    hasNotificationCircle.value = notifications.filter((n) => n.state === "pending").length > 0;
};

watch(notificationCirclesStore, updateNotificationCircles);
notificationCirclesStore.forceUpdate++;

// Session control
const router = useRouter();
const logout = () => {
    loginStore.logout();
    router.push("/");
};
</script>
