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
        <input type="checkbox" v-model="checked" ref="checkbox" @change="emitChange" />
        <span>{{ labelText }}</span>
    </label>
</template>

<script setup lang="ts">
import { ref, onMounted, defineEmits } from "vue";

const emit = defineEmits<{
    (event: "update:checked", value: boolean): void;
}>();

const props = defineProps<{
    labelText?: string;
    initialChecked?: boolean;
    indeterminate?: boolean;
}>();

const checked = ref(props.initialChecked ?? false);
const checkbox = ref<HTMLInputElement | null>(null);

onMounted(() => {
    if (checkbox.value && props.indeterminate) {
        checkbox.value.indeterminate = true;
        checked.value = false;
    }
});

const emitChange = () => {
    emit("update:checked", checked.value);
};
</script>

<style scoped>
.custom-checkbox {
    display: flex;
    flex: 1;
    align-items: center;
    color: var(--color-checkbox-text-light);
    cursor: pointer;
}
.custom-checkbox:hover {
    color: var(--color-checkbox-text-hover);
}
.custom-checkbox input[type="checkbox"]:indeterminate {
    accent-color: var(--color-checkbox-indeterminate-light);
}
.custom-checkbox input[type="checkbox"] {
    width: 20px;
    height: 20px;
    accent-color: var(--color-checkbox-checked-light);
    cursor: pointer;
}
</style>
