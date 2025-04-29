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
        <aside id="manage-shifts-sidebar-container">
            <ShiftSelector
                v-if="selectedShifts"
                v-model="selectedShifts"
                :courses="courses"
                :shifts="shifts" />
        </aside>
        <main id="manage-shifts-sidebar-main">
            {{ selectedShifts }}
        </main>
    </div>
</template>

<style scoped>
#manage-shifts-page-container {
    display: flex;
    flex: 1 0 0;
    overflow: scroll;
}

#manage-shifts-sidebar-container {
    min-width: 15em;
    display: flex;
    overflow-y: scroll;
}

#manage-shifts-sidebar-main {
    display: flex;
    flex: 1 0 0;
}
</style>

<script setup lang="ts">
import ShiftSelector from "../components/ShiftSelector.vue";

import { Course } from "../models/Course.ts";
import { Room } from "../models/Room.ts";
import { Shift } from "../models/Shift.ts";
import { User } from "../models/User.ts";

import { ref } from "vue";

// Load state
const users = ref<User[]>([]);
const shifts = ref<Shift[]>([]);
const courses = ref<Course[]>([]);
const rooms = ref<Room[]>([]);

const selectedShifts = ref<Record<string, boolean>>();

Promise.all([User.getAll(), Shift.getAll(), Course.getAll(), Room.getAll()]).then((res) => {
    [users.value, shifts.value, courses.value, rooms.value] = res;
    selectedShifts.value = Object.fromEntries(
        shifts.value.map((shift) => [String(shift.id), true])
    );
});
</script>
