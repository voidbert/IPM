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
    <div class="dropdown-wrapper">
        <label :for="props.id" class="dropdown-label">{{ props.label }}</label>

        <div class="select-container">
            <select :id="props.id" v-model="model" class="dropdown-select" @change="removeFocus">
                <option v-for="option in props.options" :key="option" :value="option">
                    {{ option }}
                </option>
            </select>

            <object data="/expand-more.svg" type="image/svg+xml" class="dropdown-icon" />
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    label: string;
    options: string[];
    id?: string;
}>();

const model = defineModel({ type: String });

function removeFocus(event: Event) {
    (event.target as HTMLSelectElement).blur();
}
</script>

<style scoped>
.dropdown-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    width: 100%;
    max-width: 400px;
}

.dropdown-label {
    font-weight: 400;
}

.select-container {
    position: relative;
}

.dropdown-select {
    width: 100%;
    padding: 0.5rem 2.5rem 0.5rem 0.75rem;
    border: 1px solid var(--color-dropdown-border);
    border-radius: 6px;
    font-size: 1rem;
    background-color: var(--color-dropdown-background);
    color: var(--color-dropdown-text);
    appearance: none;
    line-height: 1.5;
}

.dropdown-icon {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.5rem;
    height: 1.5rem;
    pointer-events: none;
}
</style>
