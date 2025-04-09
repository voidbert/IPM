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
    <div class="toggle-button">
        <div ref="left_elem" class="toggle-left active">
            <span @click="changeActive('left')"
                ><b>{{ props.left }}</b></span
            >
        </div>
        <div ref="right_elem" class="toggle-right">
            <span @click="changeActive('right')"
                ><b>{{ props.right }}</b></span
            >
        </div>
    </div>
</template>

<style scoped>
.toggle-button {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    background-color: var(--color-toggle-button);
    border-radius: 0.5rem;
    font-size: 0.8rem;
    color: var(--color-toggle-button-text);
    transition: background-color 0.1s linear;
}

.toggle-left,
.toggle-right {
    display: flex;
    justify-content: center;
    padding: 0.2rem 0.5rem;
    box-sizing: border-box;
}

.toggle-button span {
    display: flex;
    align-items: center;
    padding: 0.2rem 0.4rem;
    white-space: nowrap;
    cursor: default;
}

.toggle-left:not(.active) span:hover,
.toggle-right:not(.active) span:hover {
    background-color: var(--color-toggle-button-hover);
    border-radius: 0.5rem;
    cursor: pointer;
}

.active {
    border-radius: 0.5rem;
    background-color: var(--color-toggle-button-active);
}

.toggle-left.active {
    box-shadow:
        inset 0 0 1px var(--color-toggle-button-shadow),
        1px 0 4px rgba(0, 0, 0, 0.25);
}

.toggle-right.active {
    box-shadow:
        inset 0 0 1px var(--color-toggle-button-shadow),
        0 1px 4px rgba(0, 0, 0, 0.25);
}
</style>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps<{
    left: string;
    right: string;
}>();

const emit = defineEmits<{
    (event: "changeActive", active: "left" | "right"): void;
}>();

const left_elem = ref<HTMLDivElement>();
const right_elem = ref<HTMLDivElement>();

const changeActive = (clicked: "left" | "right") => {
    if (clicked == "left") {
        right_elem.value?.classList.remove("active");
        left_elem.value?.classList.add("active");
        emit("changeActive", "left");
    } else if (clicked == "right") {
        left_elem.value?.classList.remove("active");
        right_elem.value?.classList.add("active");
        emit("changeActive", "right");
    }
};

const calcWidth = () => {
    if (left_elem.value && right_elem.value) {
        const width = Math.max(left_elem.value.offsetWidth, right_elem.value.offsetWidth);
        left_elem.value.style.width = `${width}px`;
        right_elem.value.style.width = `${width}px`;
    }
};

onMounted(calcWidth);
</script>
