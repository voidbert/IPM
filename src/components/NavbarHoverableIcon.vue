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
    <button class="navbar-hoverable-icon" :title="props.tooltip">
        <div class="navbar-hoverable-icon-svg" />
    </button>
</template>

<style scoped>
.navbar-hoverable-icon {
    height: 100%;
    aspect-ratio: 1 / 1;

    background: none;
    border: none;
    padding: 0px;
}

.navbar-hoverable-icon-svg {
    height: 100%;

    background-color: var(--color-navbar-hoverable-icon-default);
    mask-image: v-bind("'url(\"' + props.url + '\")'");
    mask-size: cover;
}

.navbar-hoverable-icon-svg:hover {
    background-color: var(--color-navbar-hoverable-icon-hover);
    transition: background-color 0.1s;
}
</style>

<script setup lang="ts">
const props = defineProps<{
    url: string;
    tooltip: string;
}>();
</script>
