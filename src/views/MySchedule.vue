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
    <Navbar type="student" />
    <main>
        <h3>Clique num turno para mais informação</h3>
        <WeeklySchedule :shifts="shifts" id="schedule" />
    </main>
</template>

<style scoped>
main {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
}
#schedule {
    width: 80vw;
}
</style>

<script setup lang="ts">
import Navbar from "../components/Navbar.vue";
import WeeklySchedule from "../components/WeeklySchedule.vue";
import { ShiftInfo } from "../models/Shift.ts";
import { ref } from "vue";

const shifts = ref<ShiftInfo[][]>([]);

const shiftsInfo: ShiftInfo[][] = [];

const fetchShifts = async () => {
    shifts.value = shiftsInfo;
};

fetchShifts();
</script>
