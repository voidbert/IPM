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
    <nav>
        <div class="navbar-left">
            <ApplicationIcon />
            <NavbarLinks :links="links" />
        </div>

        <div class="navbar-right">
            <NavbarHoverableIcon
                v-if="themeStore.theme === 'light'"
                @click="themeStore.change()"
                url="/dark-mode.svg"
                tooltip="Modo escuro" />
            <NavbarHoverableIcon
                v-else
                @click="themeStore.change()"
                url="/light-mode.svg"
                tooltip="Modo claro" />
            <RouterLink
                to="./Notifications"
                v-if="props.type !== 'login'"
                class="navbar-hoverable-icon-container">
                <NavbarHoverableIcon url="/notifications.svg" tooltip="Notificações" />
            </RouterLink>
            <RouterLink
                to="/"
                v-if="props.type !== 'login'"
                class="navbar-hoverable-icon-container">
                <NavbarHoverableIcon url="/log-out.svg" tooltip="Terminar sessão" />
            </RouterLink>
        </div>
    </nav>
</template>

<style scoped>
nav {
    display: flex;
    height: 4rem;
    justify-content: space-between;

    background-color: var(--color-uminho);
    padding: 0px 6px;
}

.navbar-left {
    display: flex;
    justify-content: left;
}

.navbar-right {
    display: flex;
    height: 100%;
    align-items: center;

    gap: 6px;
}

.navbar-hoverable-icon-container {
    display: flex;
    height: 100%;
    align-items: center;
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

import { computed } from "vue";

const props = defineProps<{
    type: "login" | "student" | "director";
}>();

// Setup navbar links
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
                url: "/PublishSchedules"
            }
        ]
    }[props.type];
});

// Theme switching
const themeStore = useThemeStore();
</script>
