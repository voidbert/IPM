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
    <label class="custom-checkbox">
        <input
            type="checkbox"
            class="custom-checkbox-input"
            v-model="model"
            :indeterminate="model === null"
            @change="$emit('change', model as boolean | null)" />
        <slot />
    </label>
</template>

<script setup lang="ts">
import { defineModel, defineEmits } from "vue";

const model = defineModel<boolean | null>();

defineEmits<{
    (event: "change", value: boolean | null): void;
}>();
</script>

<style scoped>
.custom-checkbox {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    color: var(--color-checkbox-text-light);
    flex: 1;
}

.custom-checkbox:hover {
    color: var(--color-checkbox-text-hover);
    filter: brightness(1.5) saturate(2);
}

.custom-checkbox-input {
    width: 1.2rem;
    height: 1.2rem;
    accent-color: var(--color-checkbox-checked-light);
    cursor: pointer;
}
</style>
