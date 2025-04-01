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
    <button :class="type">{{ text }}</button>
</template>

<style scoped>
button {
    border: none;
    border-radius: 0.3em;
    width: 100%;
    height: 100%;
    padding: 1em 1em;
    font-weight: 500;
    font-size: 0.8em;
}
.confirm {
    color: var(--color-text-light);
    background-color: var(--color-uminho);
}
.disabled {
    color: var(--color-text-light);
    background-color: var(--color-button-disabled);
}
.cancel {
    color: var(--color-text-dark);
    background-color: var(--color-button-cancel);
}
:hover {
    cursor: pointer;
}
</style>

<script setup lang="ts">

defineProps<{
    type: "confirm" | "disabled" | "cancel",
    text: String,
}>();



</script>
