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

            <template v-if="props.type === 'success-with-undo'">
                <span class="toast-undo-action toast-action-hover" @click="handleUndo">
                    Desfazer
                </span>
            </template>

            <template v-else>
                <img
                    src="/close.svg"
                    class="toast-close-icon toast-action-hover"
                    role="button"
                    @click="model = false" />
            </template>
        </div>
    </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{
    type: "success" | "success-with-undo";
    duration?: number;
}>();

const emit = defineEmits<{
    (e: "undo"): void;
}>();

const model = defineModel({ type: Boolean });

const handleUndo = () => {
    emit("undo");
    model.value = false;
};

if (props.duration && props.duration > 0) {
    setTimeout(() => {
        if (model.value) model.value = false;
    }, props.duration);
}
</script>

<style scoped>
.toast {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 6px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
    background-color: var(--color-uminho);
    color: var(--color-toast-text-default);
}

.toast-message {
    flex: 1;
    padding-right: 1rem;
}

.toast-close-icon {
    width: 1.6rem;
    height: 1.6rem;
    cursor: pointer;
    user-select: none;
    margin-left: 1rem;
    color: var(--color-toast-text-default);
    pointer-events: all;
}

.toast-undo-action {
    cursor: pointer;
    font-weight: bold;
    margin-left: 1rem;
}

.toast-action-hover {
    transition: all 0.2s ease;
}

.toast-action-hover:hover {
    opacity: 0.7;
    transform: scale(1.05);
}

.toast-slide-enter-active,
.toast-slide-leave-active {
    transition: all 0.4s ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
    opacity: 0;
    transform: translate(-50%, 40px);
}
</style>
