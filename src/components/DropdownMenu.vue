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
    <label class="dropdown-menu">
        {{ props.label }}

        <div class="dropdown-menu-select-container">
            <select class="dropdown-menu-select" v-model="model">
                <option v-for="(option, i) in props.options" :key="i" :value="i">
                    {{ option }}
                </option>
            </select>
            <div class="dropdown-menu-arrow" />
        </div>
    </label>
</template>

<style scoped>
.dropdown-menu {
    display: flex;
    flex-direction: column;

    gap: 0.5em;
}

.dropdown-menu-select-container {
    position: relative;
    width: fit-content;
}

.dropdown-menu-select {
    appearance: none;

    padding: 0.5em 2.5em 0.5em 0.75em;
    border: 1px solid var(--color-dropdown-border);
    border-radius: 0.5em;

    font-size: inherit;

    background-color: var(--color-dropdown-background);
    color: var(--color-dropdown-text);

    user-select: none;
    -webkit-user-select: none;
}

.dropdown-menu-arrow {
    position: absolute;
    right: 0.75em;
    top: 50%;
    transform: translateY(-50%);

    width: 1.5em;
    height: 1.5em;

    background-color: var(--color-dropdown-icon);
    mask-image: url("/expand-more.svg");
    mask-size: cover;

    pointer-events: none;
}
</style>

<script setup lang="ts">
const props = defineProps<{
    label: string;
    options: string[];
}>();

const model = defineModel({ type: Number });
</script>
