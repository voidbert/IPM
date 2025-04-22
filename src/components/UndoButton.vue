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
    <button class="undo-button" :disabled="props.disabled">
        <div class="undo-button-icon" />
        Desfazer
    </button>
</template>

<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        disabled?: boolean;
    }>(),
    {
        disabled: false
    }
);
</script>

<style scoped>
.undo-button {
    all: unset;

    display: flex;
    align-items: center;
    justify-content: left;
    gap: 0.3rem;

    user-select: none;
    -webkit-user-select: none;

    color: var(--button-color);
    transition: color 0.2s ease;
}

.undo-button-icon {
    width: 1rem;
    height: 1rem;

    background-color: var(--button-color);
    mask-image: url("/undo-button.svg");
    mask-position: center;
    mask-size: cover;
    transition: background-color 0.2s ease;
}

.undo-button:not(:disabled) {
    --button-color: var(--color-undo-button-regular);
}

.undo-button:disabled {
    --button-color: var(--color-undo-button-disabled);
}

.undo-button:not(:disabled):hover {
    --button-color: var(--color-undo-button-hover);
}
</style>
