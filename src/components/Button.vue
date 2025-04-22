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
    <button
        :class="props.type"
        :title="props.type == 'disabled' ? props.reasonDisabled : undefined"
        :disabled="props.type === 'disabled'">
        <slot />
    </button>
</template>

<style scoped>
button {
    width: 100%;
    min-width: max-content;

    display: flex;
    align-items: center;
    justify-content: center;

    border: none;
    border-radius: 0.3em;
    padding: 0.6rem 0.6rem;

    color: v-bind(`var(--color-button-foreground-${props.type}) `);
    background-color: v-bind(`var(--color-button-background-${props.type}) `);

    font-weight: bold;
    transition: filter 0.1s linear;
}

.action:hover {
    filter: brightness(140%) saturate(0.8);
}

.cancel:hover {
    filter: brightness(80%);
}

.disabled:hover {
    cursor: not-allowed;
}
</style>

<script setup lang="ts">
const props = defineProps<{
    type: "action" | "cancel" | "disabled";
    reasonDisabled?: string;
}>();
</script>
