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
    <button class="reset button">
        <RouterLink v-if="props.link" :to="props.link" />
        <!-- Redirect -->
        <span class="reset icon" :class="type" :title="tooltip" />
    </button>
</template>

<style scoped>
.button {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5em;
    background-color: var(--color-icon-button);
    width: 1.5rem;
    height: 1.5rem;
    transition: background-color 0.1s linear;
}

.button:hover {
    background-color: var(--color-icon-button-hover);
}

.button:hover .icon {
    background-color: var(--color-icon-button-icon-hover);
}

.icon {
    background-color: var(--color-icon-button-icon);
    mask-image: url("/public/icon-accept.svg");
    mask-size: cover;
    width: 80%;
    height: 80%;
    transition: background-color 0.1s linear;
}

.accept {
    mask-image: url("/public/icon-accept.svg");
}

.reject {
    mask-image: url("/public/icon-reject.svg");
}

.view {
    mask-image: url("/public/icon-view.svg");
    width: 100%;
    height: 100%;
}
</style>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
    type: "accept" | "reject" | "view";
    link?: string;
}>();

const tooltip = computed(() => {
    let result = "";
    if (props.type == "accept") result = "Aceitar";
    else if (props.type == "reject") result = "Rejeitar";
    else if (props.type == "view") result = "Ir para";
    return result;
})
</script>
