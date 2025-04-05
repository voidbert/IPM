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
            v-for="link in props.links"
            :key="link.url"
            :to="link.url"
            :class="linkClass(link.url)">
            <li>{{ link.name }}</li>
        </RouterLink>
    </ul>
</template>

<style scoped>
.navbar-links {
    display: inline-flex;
    gap: 5pt;
}

.navbar-pill-default,
.navbar-pill-active {
    padding: 0.4em;
    border-radius: 0.3em;

    list-style-type: none;
    text-decoration: none;
}

.navbar-pill-default {
    color: var(--color-navbar-text-default);
}

.navbar-pill-active {
    color: var(--color-uminho);
    background-color: var(--color-navbar-text-default);
    text-shadow: 0px 0px 1px var(--color-uminho);
}

.navbar-pill-default:hover,
.navbar-pill-default:active {
    text-shadow: 0px 0px 1px var(--color-navbar-text-default);
}
</style>

<script setup lang="ts">
import { useRoute } from "vue-router";

const props = defineProps<{
    links: {
        name: string;
        url: string;
    }[];
}>();

const pageUrl = useRoute().path;
const linkClass = (url: string) => {
    return pageUrl === url ? "navbar-pill-active" : "navbar-pill-default";
};
</script>
