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
    <main>
        <div id="publish-schedules-title-container">
            <h1>Publicar Horários</h1>
            <h2 v-if="allProblems.length > 0">Problemas por resolver</h2>
        </div>

        <div id="publish-schedules-problems" v-if="allProblems.length > 0">
            <RouterLink
                class="publish-schedules-problem-link"
                :to="`/SolveProblems/${i}`"
                v-for="(problem, i) in allProblems"
                :key="i">
                <PresentedProblem :active="false" :problem="problem" />
            </RouterLink>
        </div>
        <template v-else>
            <h1>Publicar Horários</h1>
            <h2>Sem problemas por resolver</h2>
        </template>

        <div id="publish-schedules-buttons-container">
            <RouterLink class="publish-schedules-button-link" to="SolveProblems">
                <Button type="action">Resolver Problemas</Button>
            </RouterLink>
            <Button type="action" @click="decideToShowConfirmation()"> Publicar Horários </Button>
        </div>
    </main>

    <Popup v-model="confirmationVisible">
        <div id="publish-schedules-popup-content">
            <div id="publish-schedules-popup-question">
                <span>Tem a certeza que deseja publicar os horários?</span>
                <span>Ainda há problemas por resolver</span>
            </div>

            <div id="publish-schedules-popup-confirmation">
                <Button type="cancel" @click="confirmationVisible = false">Não</Button>
                <Button type="action" @click="publishSchedules">Sim</Button>
            </div>
        </div>
    </Popup>
</template>

<style scoped>
main {
    display: flex;
    flex: 1 0 0;

    min-height: 0;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    padding: 2rem;
    gap: 1rem;
}

#publish-schedules-title-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    gap: 1rem;
}

h1 {
    font-size: 1.5rem;
    margin: 0px;
}

h2 {
    font-size: 1rem;
    margin: 0px;
}

#publish-schedules-problems {
    width: fit-content;
    overflow: hidden scroll;
    padding-right: 1rem;
}

.publish-schedules-problem-link,
.publish-schedules-button-link {
    all: unset;
}

.publish-schedules-problem-link > * {
    border-radius: 0.5rem;
    padding: 0.5rem;
}

#publish-schedules-buttons-container {
    display: flex;
    gap: 1rem;
}

#publish-schedules-buttons-container > * {
    width: fit-content;
}

#publish-schedules-popup-content {
    display: flex;
    flex-direction: column;
}

#publish-schedules-popup-question {
    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 1rem 1rem 2rem 1rem;
    gap: 0.5rem;
}

#publish-schedules-popup-confirmation {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 1rem;
}
</style>

<script setup lang="ts">
import Button from "../components/Button.vue";
import Popup from "../components/Popup.vue";
import PresentedProblem from "../components/PresentedProblem.vue";

import { useToastsStore } from "../stores/toasts.ts";
import { Problem } from "../models/Problem.ts";
import { User } from "../models/User.ts";

import { ref } from "vue";
import { useRouter } from "vue-router";

// Problem list
const allProblems = ref<Problem[]>([]);
Problem.getAll().then((problems) => {
    allProblems.value = problems;
});

// Popup
const confirmationVisible = ref(false);
const decideToShowConfirmation = () => {
    if (allProblems.value.length > 0) {
        confirmationVisible.value = true;
    } else {
        publishSchedules();
    }
};

const router = useRouter();
const toastsStore = useToastsStore();
const publishSchedules = () => {
    User.publishSchedules();

    toastsStore.successfulSchedulePublishing = true;
    router.replace("/SolveProblems");
};
</script>
