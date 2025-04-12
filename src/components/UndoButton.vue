<!--
    Copyright 2025 Ana Oliveira, Humberto Gomes, Inês Marques,
    Rafael Vilas Boas, Sara Lopes

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
    <div class="undo-button-container" role="button" @click="emit('undo')">
        <img src="/undo-button.svg" alt="Desfazer" class="undo-button-icon" />
        <span class="undo-button-label">Desfazer</span>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
    (e: "undo"): void;
}>();
</script>

<style scoped>
.undo-button-container {
    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
    font-weight: 500;
    color: var(--color-undo-button-text);

    gap: 0.3rem;
}

.undo-button-container:hover {
    opacity: 0.5;
}
</style>
