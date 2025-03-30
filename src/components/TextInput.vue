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
    <div class="text_input">
        <input type="text" :class="props.type" :placeholder="props.placeholder" />
        <object v-if="props.type == 'search'" data="/search.svg" id="search-logo-svg" />
    </div>
</template>

<style scoped>
.text_input {
    display: flex;
    flex-direction: row;
}
.text-input {
    display: flex;
    width: 723px;
    height: 1.5rem;
    align-items: center;
    border-radius: 1px;
    border: 2px solid var(--color-searchbar-border);
    background: var(--color-body-background);
}
input[class="search"] {
    padding-right: 30px;
}
.search {
    display: flex;
    width: 723px;
    height: 1.5rem;
    align-items: center;
    border-radius: 10px;
    border: 2px solid var(--color-searchbar-border);
    background: var(--color-body-background);
}
#search-logo-svg {
    height: 1rem;
    position: relative;
    top: 0.3rem;
    right: 25px;
}
</style>

<script setup lang="ts">
const props = defineProps<{
    type: "text-input" | "search";
    placeholder: string;
}>();
console.log(props.type);
</script>
