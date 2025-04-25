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
    <div id="solve-problems-page-container" v-if="allProblems.length > 0">
        <aside id="solve-problems-sidebar" :style="fixedSideBarWidth">
            <TextInput
                type="search"
                placeholder="Pesquisar"
                v-model="problemSearch"
                v-on:update:modelValue="updateSideBarWidth" />

            <div id="solve-problems-sidebar-problems">
                <div
                    class="solve-problems-problem-container"
                    v-for="(problem, i) in allProblems"
                    :key="i">
                    <PresentedProblem
                        v-if="mustShowProblem(problem)"
                        :active="i === activeProblem"
                        :problem="problem"
                        @click="activeProblem = i" />
                </div>
            </div>
        </aside>

        <main>Hello, world!</main>
    </div>
    <div id="solve-problems-empty" v-else>Sem problemas por resolver</div>

    <Toast type="success" :model-value="toastsStore.successfulSchedulePublishing">
        Horários publicados com sucesso!
    </Toast>
</template>

<style scoped>
#solve-problems-page-container,
#solve-problems-empty {
    flex: 1 0 0;
}

#solve-problems-page-container {
    display: flex;

    padding: 0.5rem;
    gap: 1rem;
}

#solve-problems-sidebar {
    display: flex;
    flex-direction: column;

    gap: 0.5rem;
}

#solve-problems-sidebar-problems {
    display: flex;
    flex-direction: column;
    flex: 1 0 0;

    overflow: hidden scroll;
    padding-right: 1rem;
}

#solve-problems-empty {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>

<script setup lang="ts">
import PresentedProblem from "../components/PresentedProblem.vue";
import TextInput from "../components/TextInput.vue";
import Toast from "../components/Toast.vue";

import { useToastsStore } from "../stores/toasts.ts";
import { Problem } from "../models/Problem.ts";

import { ref } from "vue";

const props = defineProps<{
    problem?: string; // Must be a number casted to string (router limitations)
}>();

// Sidebar
const allProblems = ref<Problem[]>([]);
Problem.getAll().then((problems) => {
    allProblems.value = problems;
});

const problemSearch = ref("");
const activeProblem = ref(Number(props.problem) || 0);
const mustShowProblem = (problem: Problem) => {
    const searchString = problemSearch.value.toLowerCase();
    return (
        problem.student.name.toLowerCase().includes(searchString) ||
        (problem.student.number as string).toLowerCase().includes(searchString) ||
        problem.description.toLowerCase().includes(searchString)
    );
};

// Always keep the side bar's width the same, despite the elements actually being shown
const fixedSideBarWidth = ref("");
const updateSideBarWidth = () => {
    if (!fixedSideBarWidth.value) {
        const width = getComputedStyle(
            document.getElementById("solve-problems-sidebar") as HTMLElement
        ).width;
        fixedSideBarWidth.value = `width: ${width};`;
    }
};

// Toast
const toastsStore = useToastsStore();
</script>
