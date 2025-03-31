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
    <transition name="fade">
        <div class="toast" v-if="model" :class="toastClass">
            <template v-if="props.type === 'undo'">
                <span class="material-icons-round toast-undo-icon">undo</span>
                <span class="toast-undo-label" @click="handleUndo">
                    <slot name="undo">Desfazer</slot>
                </span>
            </template>

            <template v-else>
                <span class="toast-message">
                    <slot />
                </span>

                <template v-if="props.type === 'success-with-undo'">
                    <span class="toast-undo-action" @click="handleUndo">
                        <slot name="action">Desfazer</slot>
                    </span>
                </template>

                <template v-else>
                    <span class="material-icons-round toast-close-icon" @click="model = false"
                        >close</span
                    >
                </template>
            </template>
        </div>
    </transition>
</template>

<script setup lang="ts">
const props = defineProps<{
    type: "success" | "success-with-undo" | "undo";
    duration?: number;
    onUndo?: () => void;
}>();

const model = defineModel({ type: Boolean });

const toastClass = props.type === "undo" ? "toast undo" : "toast success";

function handleUndo(): void {
    if (props.onUndo) props.onUndo();
    model.value = false;
}

if (props.duration && props.duration > 0) {
    setTimeout(() => {
        model.value = false;
    }, props.duration);
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Icons+Round");

.toast {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    max-width: 400px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 0.95rem;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
}

.toast.success {
    background-color: var(--color-uminho);
    color: var(--color-toast-text-default);
}

.toast.undo {
    background-color: var(--color-toast-text-default);
    color: var(--color-toast-muted);
    box-shadow: none;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    justify-content: flex-start;
}

.toast-message {
    flex: 1;
    padding-right: 1rem;
}

.toast-close-icon {
    font-size: 1.6rem;
    cursor: pointer;
    user-select: none;
    margin-left: 1rem;
}

.toast-undo-action {
    cursor: pointer;
    font-weight: bold;
    margin-left: 1rem;
}

.toast-undo-icon {
    font-size: 1.2rem;
    color: var(--color-toast-muted);
}

.toast-undo-label {
    cursor: pointer;
    color: var(--color-toast-muted);
    font-weight: 500;
    font-size: 0.95rem;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
