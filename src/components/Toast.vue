<!--
    Copyright 2025 Ana Oliveira, Humberto Gomes, Inês Marques,
    Rafael Vilas Boas, Sara Lopes

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
    <Transition name="toast-slide">
        <div class="toast" v-if="model" role="alert">
            <span class="toast-message">
                <slot />
            </span>

            <button
                v-if="props.type === 'undo'"
                class="toast-button toast-undo-action"
                @click="handleUndo">
                Desfazer
            </button>
            <button v-else class="toast-button toast-close-icon" @click="model = false" />
        </div>
    </Transition>
</template>

<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        type: "success" | "undo";
        duration?: number;
    }>(),
    {
        duration: 5000
    }
);

const emit = defineEmits<{
    (e: "undo"): void;
}>();

const model = defineModel({ type: Boolean });

const handleUndo = () => {
    emit("undo");
    model.value = false;
};

setTimeout(() => {
    model.value = false;
}, props.duration);
</script>

<style scoped>
.toast {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);

    display: flex;
    align-items: center;
    justify-content: space-between;

    background-color: var(--color-toast-background);
    color: var(--color-toast-text-default);

    border-radius: 0.5rem;
    padding: 1rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
}

.toast-button {
    all: unset;
    display: flex;
    align-items: center;
    justify-content: space-between;

    cursor: default;
    margin-left: 1rem;
}

.toast-button:hover {
    --color-toast-foreground: var(--color-toast-hover);
}

.toast-close-icon {
    width: 1.5rem;
    height: 1.5rem;
    margin-left: 1rem;

    background-color: var(--color-toast-foreground);
    mask-image: url("/close.svg");
    mask-size: cover;
}

.toast-undo-action {
    font-weight: bold;
    color: var(--color-toast-foreground);
}

.toast-slide-enter-active,
.toast-slide-leave-active {
    transition: all 0.4s ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
    transform: translate(-50%, 6rem);
}
</style>
