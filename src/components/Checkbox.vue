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
    <label class="checkbox">
        <input
            type="checkbox"
            class="checkbox-input"
            v-model="model"
            :indeterminate="model === null" />
        <slot />
    </label>
</template>

<style scoped>
.checkbox {
    display: flex;
    align-items: center;
    gap: 0.5em;

    color: var(--color-checkbox-foreground);
}

.checkbox-input {
    width: 1em;
    height: 1em;
    margin-left: 0px;

    font-size: inherit;
    accent-color: var(--color-checkbox-checked);
}

.checkbox-input:not(:checked) {
    filter: brightness(var(--color-checkbox-unchecked));
}

.custom-checkbox-input:indeterminate {
    filter: brightness(var(--color-checkbox-checked));
}
</style>

<script setup lang="ts">
const model = defineModel<boolean | null>();
</script>
