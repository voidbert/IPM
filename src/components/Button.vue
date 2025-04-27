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
        :class="'button'"
        :title="props.type == 'disabled' ? props.reasonDisabled : undefined"
        :disabled="props.type === 'disabled'">
        <slot />
    </button>
</template>

<style scoped>
.button {
    min-width: max-content;

    display: flex;
    align-items: center;
    justify-content: center;

    border: none;
    border-radius: 0.5em;
    padding: 0.5em 0.5em;

    color: v-bind(`var(--color-button-foreground-${props.type}) `);
    background-color: v-bind(`var(--color-button-background-${props.type}) `);

    font-weight: bold;
    font-size: inherit;

    transition:
        background-color 0.1s,
        color 0.1s;
}

.button:hover {
    background-color: v-bind(`var(--color-button-background-${props.type}-hover) `);
}
</style>

<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        type?: "action" | "cancel" | "disabled";
        reasonDisabled?: string;
    }>(),
    {
        type: "action"
    }
);
</script>
