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
    <div class="student">
        <img
            class="student-picture"
            :src="props.studentProfilePictureUrl"
            v-if="props.studentProfilePictureUrl" />
        <div class="student-fallback-picture" v-else />

        <div class="student-info-container">
            <span class="student-name">{{ props.studentName }} ({{ props.studentNumber }})</span>
            <span class="student-problem">{{ props.problemDescription }}</span>
            <Warning v-if="props.studentSpecial">Trabalhador estudante</Warning>
        </div>
    </div>
</template>

<style scoped>
.student {
    display: flex;
    justify-content: left;
    align-items: center;
    gap: 0.5rem;

    width: 100%;
    height: 6rem;
}

.student-picture,
.student-fallback-picture {
    height: 100%;
    aspect-ratio: 1 / 1;

    mask-size: cover;
}

/* NOTE: border-radius: 50% would result in a circle larger than the fallback image */
.student-picture {
    mask-image: url("/person-mask.svg");
}

.student-fallback-picture {
    background-color: var(--color-student-profile-picture-fallback);
    mask-image: url("/person.svg");
}

.student-info-container {
    height: calc(100% - 2 * 0.5rem);

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
}

.student-name {
    color: var(--color-student-name);
}

.student-problem {
    font-weight: bold;
}
</style>

<script setup lang="ts">
import Warning from "./Warning.vue";

const props = defineProps<{
    studentNumber: string;
    studentName: string;
    studentSpecial: boolean;
    studentProfilePictureUrl: string | undefined;
    problemDescription: string;
}>();
</script>
