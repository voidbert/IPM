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
        <dialog open class="toast" v-if="model">
            <span class="toast-message">
                <slot />
            </span>

            <button
                v-if="props.type === 'undo'"
                class="toast-button toast-undo-action"
                @click="handleUndo">
                Desfazer
            </button>
            <NavbarHoverableIcon
                v-else
                class="toast-button toast-close-icon"
                url="/close.svg"
                tooltip="Fechar"
                @click="model = false" />
        </dialog>
    </Transition>
</template>

<style scoped>
.toast {
    all: unset;

    position: fixed;
    bottom: 2em;
    left: 50%;
    transform: translateX(-50%);

    display: flex;
    align-items: center;
    gap: 1em;

    background-color: var(--color-toast-background);
    color: var(--color-toast-foreground);

    border-radius: 0.5em;
    padding: 1em;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);

    z-index: 2;
}

@media (orientation: portrait) {
    .toast {
        font-size: 0.8em;
    }

    .toast-message {
        white-space: nowrap;
    }
}

.toast-button {
    background: none;
    border: none;
    padding: 0px;
    font-size: inherit;
}

.toast-close-icon {
    height: 1.5em;
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
    transform: translate(-50%, 6em);
}
</style>

<script setup lang="ts">
import NavbarHoverableIcon from "./NavbarHoverableIcon.vue";

const props = withDefaults(
    defineProps<{
        type?: "success" | "undo";
        duration?: number;
    }>(),
    {
        type: "success",
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

document.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
        model.value = false;
    }
});
</script>
