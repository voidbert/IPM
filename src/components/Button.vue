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
    <button :class="type">
        <slot>{{ text }}</slot>
    </button>
</template>

<style scoped>
button {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 0.3em;
    padding: 1.2rem 1.2rem;
    width: 100%;
    height: 100%;
    transition: filter 0.1s linear;
}
.action {
    color: var(--color-text-light);
    background-color: var(--color-uminho);
}
.disabled {
    color: var(--color-text-light);
    background-color: var(--color-button-disabled);
}
.light {
    color: var(--color-text-dark);
    background-color: var(--color-button-cancel);
}
.action:hover {
    filter: brightness(140%) saturate(0.8);
}
.disabled:hover {
    cursor: not-allowed;
}
.light:hover {
    filter: brightness(80%);
}
:hover:not(.disabled) {
    cursor: pointer;
    transition: filter 0.1s linear;
}
</style>

<script setup lang="ts">
defineProps<{
    type: "action" | "disabled" | "light";
    text?: String;
}>();
</script>
