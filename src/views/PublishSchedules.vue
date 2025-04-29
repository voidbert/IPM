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
    <main id="publish-schedules">
        <div id="publish-schedules-title-container">
            <h1>Publicar Horários</h1>
            <h2 v-if="problems.length > 0">Problemas por resolver</h2>
        </div>

        <div id="publish-schedules-problems" v-if="problems.length > 0 && courses">
            <PresentedProblem
                v-for="(problem, i) in problems"
                :key="i"
                :problem="problem"
                :description="describe(problem)"
                @click="router.push(`/SolveProblems/${i}`)" />
        </div>
        <h2 v-else>Sem problemas por resolver</h2>

        <div id="publish-schedules-buttons-container">
            <Button @click="router.push('/SolveProblems')">Resolver Problemas</Button>
            <Button @click="decideToShowConfirmation()">Publicar Horários</Button>
        </div>
    </main>

    <Popup v-model="confirmationVisible">
        <div id="publish-schedules-popup-content">
            <div id="publish-schedules-popup-questions">
                <span class="publish-schedules-popup-question">
                    Tem a certeza que deseja publicar os horários?
                </span>
                <span class="publish-schedules-popup-question">
                    Ainda há problemas por resolver e não há como reverter esta ação.
                </span>
            </div>

            <div id="publish-schedules-popup-confirmation">
                <Button type="cancel" @click="confirmationVisible = false">Não</Button>
                <Button @click="publishSchedules">Sim</Button>
            </div>
        </div>
    </Popup>
</template>

<style scoped>
#publish-schedules {
    display: flex;
    flex: 1 0 0;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    padding: 2em;
    gap: 1em;
}

#publish-schedules-title-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    gap: 1em;
}

h1 {
    font-size: 1.5em;
    margin: 0px;
}

h2 {
    font-size: 1em;
    margin: 0px;
}

#publish-schedules-problems {
    flex: 1 0 0;
    overflow: hidden scroll;
}

#publish-schedules-buttons-container {
    display: flex;
    gap: 1em;
}

#publish-schedules-popup-content {
    display: flex;
    flex-direction: column;
}

#publish-schedules-popup-questions {
    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 1em 1em 2em 1em;
    gap: 0.5em;
}

.publish-schedules-popup-question {
    text-align: center;
}

#publish-schedules-popup-confirmation {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 1em;
}

#publish-schedules-popup-confirmation > * {
    width: 8em;
}
</style>

<script setup lang="ts">
import Button from "../components/Button.vue";
import Popup from "../components/Popup.vue";
import PresentedProblem from "../components/PresentedProblem.vue";

import { useToastsStore } from "../stores/toasts.ts";
import { Business } from "../models/Business.ts";
import { Course } from "../models/Course.ts";
import { Problem } from "../models/Problem.ts";

import { ref } from "vue";
import { useRouter } from "vue-router";

// Problem list
const problems = ref<Problem[]>([]);
Business.getProblems().then((ps) => {
    problems.value = ps;
});

const courses = ref<Course[]>();
Course.getAll().then((cs) => {
    courses.value = cs;
});

const describe = (problem: Problem): string => {
    const course = courses.value.find((c) => c.id === problem.courseId) as Course;
    if (problem.type === "unassignedShift") {
        return `${course.shortName} ${problem.shiftType} (por atribuir)`;
    } else {
        return `${course.shortName} ${(problem.originalShift as Shift).name} → ${(problem.replacementShift as Shift).name}`;
    }
};

// Popup
const confirmationVisible = ref(false);
const decideToShowConfirmation = () => {
    if (problems.value.length > 0) {
        confirmationVisible.value = true;
    } else {
        publishSchedules();
    }
};

const router = useRouter();
const toastsStore = useToastsStore();
const publishSchedules = async () => {
    await Business.publishSchedules();
    toastsStore.successfulSchedulePublishing = true;
    router.push("/SolveProblems");
};
</script>
