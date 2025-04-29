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
    <div id="manage-shifts-page-container">
        <aside id="manage-shifts-sidebar">
            <h1 id="manage-shifts-sidebar-title">Turnos</h1>
            <ShiftSelector
                v-if="selectedShifts"
                v-model="selectedShifts"
                :courses="courses"
                :shifts="shifts" />
        </aside>
        <main id="manage-shifts-sidebar-main">
            <Schedule :shifts="scheduleShifts" @clickShift="handleShiftClick" />
        </main>
    </div>
</template>

<style scoped>
#manage-shifts-page-container {
    display: flex;
    flex: 1 0 0;
    overflow: scroll;
}

#manage-shifts-sidebar {
    min-width: 15em;
    display: flex;
    flex-direction: column;
    overflow: scroll;
}

#manage-shifts-sidebar-title {
    margin: 0em 1em 0.5em 0.5em;
    padding: 0.5em;
    border-bottom: 1px solid var(--color-body-foreground);
}

#manage-shifts-sidebar-main {
    display: flex;
    flex-direction: column; /* For horizontal schedule growth */
    margin: 1rem;
    overflow: scroll;
}
</style>

<script setup lang="ts">
import { ScheduleShift } from "../components/PresentedShift.vue";
import Schedule from "../components/Schedule.vue";
import ShiftSelector from "../components/ShiftSelector.vue";

import { Course } from "../models/Course.ts";
import { Room } from "../models/Room.ts";
import { Shift } from "../models/Shift.ts";
import { User } from "../models/User.ts";

import { computed, ref } from "vue";
import { useRouter } from "vue-router";

// Load state
const users = ref<User[]>([]);
const shifts = ref<Shift[]>([]);
const courses = ref<Course[]>([]);
const rooms = ref<Room[]>([]);

const selectedShifts = ref<Record<string, boolean>>({});

Promise.all([User.getAll(), Shift.getAll(), Course.getAll(), Room.getAll()]).then((res) => {
    [users.value, shifts.value, courses.value, rooms.value] = res;
    selectedShifts.value = Object.fromEntries(
        shifts.value.map((shift) => [String(shift.id), true])
    );
});

// Schedule
const scheduleShifts = computed(() =>
    shifts.value
        .filter((shift) => selectedShifts.value[String(shift.id)])
        .map((shift) => {
            const course = courses.value.find((c) => c.id === shift.course) as Course;
            const room = rooms.value.find((r) => r.id === shift.room) as Room;

            return {
                shift: shift,
                course: course,
                room: room
            };
        })
);

const router = useRouter();
const handleShiftClick = (shift: ScheduleShift) => {
    router.push(`/ManageShifts/${shift.shift.id}`);
};
</script>
