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
    <div
        :class="{
            problem: true,
            'problem-active': props.active,
            'problem-interactive': !props.interactive
        }"
        :tabindex="props.interactive ? 0 : -1"
        @keyup.enter="$emit('click')">
        <img
            v-if="props.problem.student.profilePicture"
            class="problem-student-picture"
            :src="props.problem.student.profilePicture" />
        <div v-else class="problem-student-fallback-picture" />

        <div class="problem-info-container">
            <span class="problem-student-name">
                {{ props.problem.student.name }} ({{ props.problem.student.number }})
            </span>
            <span class="problem-description">{{ props.description }}</span>
            <Warning v-if="props.problem.student.specialStatus">Trabalhador estudante</Warning>
        </div>
    </div>
</template>

<style scoped>
.problem {
    display: flex;
    align-items: center;

    gap: 0.5em;
    padding: 0.5em;

    font-size: 0.8em;
    border-radius: 0.5em;

    transition: background-color 0.1s color 0.2s;
    cursor: default;
}

.problem-active {
    background-color: var(--color-problem-active);
}

.problem:not(.problem-active):not(.problem-interactive):hover {
    background-color: var(--color-problem-hover);
}

.problem-student-picture,
.problem-student-fallback-picture {
    height: 4.5em;
    border-radius: 50%;
    aspect-ratio: 1 / 1;
}

.problem-student-fallback-picture {
    background-color: var(--color-problem-student-profile-picture-fallback);
    mask-image: url("/person.svg");
    mask-size: cover;
}

.problem-info-container {
    display: flex;
    flex-direction: column;
    gap: 0.25em;
}

.problem-student-name {
    white-space: nowrap;
    color: var(--color-problem-student-name);
}

.problem-description {
    font-weight: bold;
    color: var(--color-problem-description);
}
</style>

<script setup lang="ts">
import Warning from "./Warning.vue";

import { Problem } from "../models/Problem.ts";

export interface ProblemInfo {
    problem: Problem;
    description?: string;
    active?: boolean;
    interactive?: boolean;
}

const props = withDefaults(defineProps<ProblemInfo>(), {
    description: "",
    active: false,
    interactive: true
});
</script>
