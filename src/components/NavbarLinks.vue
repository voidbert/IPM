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
    <ul class="navbar-links">
        <RouterLink
            class="navbar-links-pill"
            v-for="link in props.links"
            :key="link.url"
            :to="link.url">
            <li>
                {{ link.name }}
                <NotificationCircle v-if="link.notificationCircle" />
            </li>
        </RouterLink>
    </ul>
</template>

<style scoped>
.navbar-links {
    display: flex;
    gap: 0.5em;
}

.navbar-links-pill {
    list-style-type: none;
    text-decoration: none;

    position: relative;
    padding: 0.5em;
    border-radius: 0.5em;

    color: var(--color-navbar-link-inactive-foreground);
    background-color: var(--color-navbar-link-inactive-background);

    transition:
        background-color 0.1s,
        color 0.1s;
}

.navbar-links-pill.router-link-active {
    color: var(--color-navbar-link-active-foreground);
    background-color: var(--color-navbar-link-active-background);
    text-shadow: 0px 0px 1px var(--color-navbar-link-active-foreground);
}

.navbar-links-pill:hover:not(.router-link-active) {
    background-color: var(--color-navbar-link-inactive-hover);
}
</style>

<script setup lang="ts">
import NotificationCircle from "./NotificationCircle.vue";

const props = defineProps<{
    links: {
        name: string;
        url: string;
        notificationCircle?: boolean;
    }[];
}>();
</script>
