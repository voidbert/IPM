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
    <div class="text-input">
        <input
            :type="props.type == 'password' ? 'password' : 'text'"
            :class="['text-input-' + props.type, 'text-input-input']"
            v-model="model"
            :placeholder="props.placeholder"
            aria-label="Input" />
        <div v-if="props.type == 'search'" class="text-input-search-logo" />
    </div>
</template>

<style scoped>
.text-input {
    position: relative;
}

.text-input-input {
    box-sizing: border-box;
    width: 100%;
    height: 2em;

    font-size: inherit;

    border: 1px solid var(--color-text-input-border);
    background-color: var(--color-text-input-background);
    color: var(--color-text-input-foreground);
}

.text-input::placeholder {
    color: var(--color-text-input-placeholder);
}

.text-input-search {
    border-radius: 1em;
    padding-right: 2.5em;
    padding-left: 1em;
}

.text-input-text,
.text-input-password {
    border-radius: 5px;
    padding: 0.5em;
}

.text-input-search-logo {
    position: absolute;
    height: 1.5em;
    width: 1.5em;
    right: 0.5em;
    top: 0.25em;

    background-color: var(--color-text-input-border);
    mask: url("/search.svg");
    mask-size: cover;
}
</style>

<script setup lang="ts">
const model = defineModel<string>();

const props = withDefaults(
    defineProps<{
        type?: "text" | "password" | "search";
        placeholder: string;
    }>(),
    {
        type: "text"
    }
);
</script>
