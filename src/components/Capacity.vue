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
    <span class="capacity">
        <template v-if="props.showDescription">Lotação:</template>
        {{ props.attendence }} / {{ props.capacity }}
        <span class="capacity-icon" />
    </span>
</template>

<style scoped>
.capacity {
    display: flex;
    gap: 0.5em;
    color: v-bind(`var(${colorVar}) `);
}

.capacity-icon {
    width: 1.3em;
    height: 1.3em;

    background-color: v-bind(`var(${colorVar}) `);
    mask-image: url("/person-no-circle.svg");
    mask-size: cover;
}
</style>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
    defineProps<{
        attendence: number;
        capacity: number;
        showDescription?: boolean;
        regularColorVar?: string;
        overColorVar?: string;
    }>(),
    {
        showDescription: true,
        regularColorVar: "--color-body-foreground",
        overColorVar: "--color-uminho"
    }
);

// @ts-expect-error TypeScript doesn't see this is used in the CSS
const colorVar = computed(() =>
    props.attendence > props.capacity ? props.overColorVar : props.regularColorVar
);
</script>
