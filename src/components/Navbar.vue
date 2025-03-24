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
            <object data="/favicon.svg" id="navbar-logo-svg" />
            <span id="navbar-logo-text">SWAP</span>
            <NavbarLinks :links="links" />
        </div>

        <div class="navbar-right">
            <NavbarHoverableIcon url="/dark-mode.svg" tooltip="Modo escuro" />
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
    padding: 0px 10px 0px 0px;

    background-color: var(--color-uminho);
}

.navbar-left,
.navbar-right {
    display: flex;
    gap: 6px;
    height: 100%;

    align-items: center;
}

#navbar-logo-svg {
    height: 100%;
}

#navbar-logo-text {
    color: var(--color-navbar-text-default);
    font-size: 1.5em;
    font-weight: bold;

    cursor: default;
    user-select: none;
    -webkit-user-select: none;
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
import NavbarHoverableIcon from "./NavbarHoverableIcon.vue";
import NavbarLinks from "./NavbarLinks.vue";

const props = defineProps<{
    type: "login" | "student" | "director";
}>();

// Setup navbar links
const links = {
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

console.log(props.type);
</script>
