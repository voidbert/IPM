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
    <div class="problem" :class="props.active ? ['active'] : ['']">
        <img
            class="problem-student-picture"
            :src="props.problem.student.profilePicture"
            v-if="props.problem.student.profilePicture" />
        <div class="problem-student-fallback-picture" v-else />

        <div class="problem-info-container">
            <span class="student-name">
                {{ props.problem.student.name }} ({{ props.problem.student.number }})
            </span>
            <span class="problem-description">{{ props.problem.description }}</span>
            <Warning v-if="props.problem.student.specialStatus">Trabalhador estudante</Warning>
        </div>
    </div>
</template>

<style scoped>
.problem {
    width: 100%;
    height: 4.5rem;

    display: flex;
    justify-content: left;
    align-items: center;
    gap: 0.5rem;

    font-size: 0.8rem;

    transition: background-color 0.1s;
}

.problem.active {
    background-color: var(--color-problem-active);
}

.problem:not(.active):hover {
    background-color: var(--color-problem-hover);
}

.problem-student-picture,
.problem-student-fallback-picture {
    height: 100%;
    aspect-ratio: 1 / 1;
}

.problem-student-picture {
    border-radius: 50%;
}

.problem-student-fallback-picture {
    background-color: var(--color-problem-student-profile-picture-fallback);
    mask-image: url("/person.svg");
    mask-size: cover;
}

.problem-info-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    gap: 0.3rem;
}

.student-name {
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

const props = defineProps<{
    problem: Problem;
    active: boolean;
}>();
</script>
