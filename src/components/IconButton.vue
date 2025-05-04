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
    <button
        class="icon-button"
        :disabled="props.disabled"
        :aria-label="props.disabled ? 'Botão desativado' : `Botão ${tooltip}`">
        <span
            class="icon-button-icon"
            :class="`icon-button-icon-${props.type}`"
            :title="props.disabled ? undefined : tooltip" />
    </button>
</template>

<style scoped>
.icon-button {
    border: none;

    width: 2em;
    height: 2em;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0.2em;
    border-radius: 0.5em;

    background: var(--color-icon-button);
    transition: background-color 0.1s linear;
}

.icon-button:hover:not(:disabled) {
    background-color: var(--color-icon-button-hover);
}

.icon-button:hover:not(:disabled) .icon-button-icon {
    background-color: var(--color-icon-button-icon-hover);
}

.icon-button:disabled {
    background-color: var(--color-icon-button-disabled);
}

.icon-button:disabled > .icon-button-icon {
    background-color: var(--color-icon-button-icon-disabled);
}

.icon-button-icon {
    background-color: var(--color-icon-button-icon);
    mask-size: cover;

    width: 100%;
    height: 100%;
    transition: background-color 0.1s linear;
}

.icon-button-icon-accept {
    mask-image: url("/accept.svg");
}

.icon-button-icon-reject {
    mask-image: url("/reject.svg");
}

.icon-button-icon-view {
    mask-image: url("/view.svg");
}
</style>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
    defineProps<{
        type: "accept" | "reject" | "view";
        disabled?: boolean;
    }>(),
    {
        disabled: false
    }
);

const tooltip = computed(() => {
    return {
        accept: "Aceitar",
        reject: "Rejeitar",
        view: "Ir para"
    }[props.type];
});
</script>
