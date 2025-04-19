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
    <div class="text-input-container">
        <div v-if="props.type == 'search'" class="search-logo-svg" />
        <input
            :type="props.type == 'password' ? 'password' : 'text'"
            :class="[props.type, 'text-input']"
            v-model="model"
            :placeholder="props.placeholder" />
    </div>
</template>

<style scoped>
.text-input-container {
    position: relative;
    display: block;
}

.text-input {
    box-sizing: border-box;
    width: 100%;
    height: 2rem;

    border: 1px solid var(--color-text-input-border);
    background-color: var(--color-text-input-background);
    color: var(--color-text-input-foreground);
}

.text-input::placeholder {
    color: var(--color-text-input-placeholder);
}

.search {
    border-radius: 1rem;
    padding-right: 1.5rem;
    padding-left: 0.5rem;
}

.text,
.password {
    border-radius: 5px;
    padding: 0.5rem;
}

.search-logo-svg {
    position: absolute;
    height: 1.5rem;
    width: 1.5rem;
    right: 0.25rem;
    top: 0.25rem;

    background-color: var(--color-text-input-border);
    mask: url("/search.svg");
    mask-size: cover;
}
</style>

<script setup lang="ts">
const model = defineModel<string>();

const props = defineProps<{
    type: "text" | "password" | "search";
    placeholder: string;
}>();
</script>
