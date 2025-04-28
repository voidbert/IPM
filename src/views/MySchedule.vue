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
        <span id="my-schedule-tip">Clique num turno para mais informação</span>
        <div id="my-schedule-schedule-container">
            <Schedule id="my-schedule-schedule" :shifts="scheduleShifts" />
        </div>
    </main>
</template>

<style scoped>
main {
    display: flex;
    flex: 1 0 0;
    justify-content: flex-start;
    flex-direction: column;
    overflow: scroll;

    gap: 1em;
    padding: 1em;
}

#my-schedule-tip {
    position: fixed;
    top: 4rem; /* Hardcoded navbar height */
    left: 50vw;
    transform: translateX(-50%);

    padding: 1rem;
    font-weight: bold;
}

#my-schedule-schedule-container {
    flex: 1 0 0;
    margin-top: 2rem;
}
</style>

<script setup lang="ts">
import Schedule from "../components/Schedule.vue";
import { ScheduleShift } from "../components/PresentedShift.vue";

import { useLoginStore } from "../stores/login.ts";
import { Course } from "../models/Course.ts";
import { Room } from "../models/Room.ts";
import { Shift } from "../models/Shift.ts";
import { User } from "../models/User.ts";

import { ref } from "vue";

const loginStore = useLoginStore();
const scheduleShifts = ref<ScheduleShift[]>([]);

Promise.all([
    User.getByEmail(loginStore.email as string),
    Shift.getAll(),
    Course.getAll(),
    Room.getAll()
]).then((res) => {
    const [user, shifts, courses, rooms] = res;
    scheduleShifts.value = (user as User).committedSchedule.map((shiftId) => {
        const shift = shifts.find((s) => s.id === shiftId) as Shift;
        const course = courses.find((c) => c.id === shift.course) as Course;
        const room = rooms.find((r) => r.id === shift.room) as Room;

        return {
            shift: shift,
            course: course,
            room: room,
            showCapacity: false
        };
    });
});
</script>
