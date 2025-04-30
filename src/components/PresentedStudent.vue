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
        <PresentedProblem v-bind="problem" />
        <Button class="student-button" @click="$emit('act')">{{
            type === "add" ? "+" : "⨯"
        }}</Button>
    </div>
</template>

<style scoped>
.student {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.student-button {
    margin: 0em 1.5em 0em 1em;
}
</style>

<script setup lang="ts">
import Button from "./Button.vue";
import PresentedProblem from "./PresentedProblem.vue";

import { Problem } from "../models/Problem.ts";
import { User } from "../models/User.ts";

import { computed } from "vue";

const props = defineProps<{
    student: User;
    type: "add" | "remove";
}>();

defineEmits<{
    (e: "act"): void;
}>();

const problem = computed(() => ({
    problem: new Problem(1, props.student, 0, "T", "request"),
    interactive: false
}));
</script>
