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
    <main id="manage-shift-page-container">
        <div id="manage-shift-info" v-if="shift && course && professor">
            <h1>{{ course.shortName }} – {{ shift.type }}{{ shift.number }}</h1>
            <h2>
                {{ formatDayOfWeek(shift.day) }}, {{ formatTime(shift.start) }} –
                {{ formatTime(shift.end) }}
            </h2>
            <h3>Docente: {{ professor.name }}</h3>

            <DropdownMenu
                id="manage-shift-room-dropdown"
                v-model="selectedRoom"
                label="Sala"
                :options="roomNames" />
        </div>
    </main>
</template>

<style scoped>
#manage-shift-page-container {
    padding: 0.5rem;
}

#manage-shift-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    padding: 1rem;
}

#manage-shift-info > * {
    margin: 0px;
}

#manage-shift-info > h3 {
    font-weight: 400;
}

#manage-shift-room-dropdown {
    margin-top: 1rem;
}
</style>

<script setup lang="ts">
import DropdownMenu from "../components/DropdownMenu.vue";

import { formatDayOfWeek, formatTime } from "../models/Utils.ts";
import { Course } from "../models/Course.ts";
import { AvailableRoom, Room } from "../models/Room.ts";
import { Shift } from "../models/Shift.ts";
import { User } from "../models/User.ts";

import { ref } from "vue";

const props = defineProps<{
    shiftId: string; // Must be a number casted to string (router limitations)
}>();

// Sidebar
const shift = ref<Shift | undefined>(undefined);
const course = ref<Course | undefined>(undefined);
const professor = ref<User | undefined>(undefined);
const rooms = ref<AvailableRoom[]>([]);
const roomNames = ref<string[]>([]);
const selectedRoom = ref(0);

Shift.getById(Number(props.shiftId)).then((s) => {
    shift.value = s;

    Course.getById(shift.value.course).then((c) => {
        course.value = c;
    });

    User.getById(shift.value.professor).then((p) => {
        professor.value = p;
    });
});

Room.getAlternatives(Number(props.shiftId)).then(async (alternatives) => {
    rooms.value = alternatives;
    roomNames.value = await Promise.all(
        rooms.value.map(async (availableRoom) => {
            const name = availableRoom.room.name;
            const capacity = availableRoom.room.capacity;
            const emoji = String.fromCodePoint(0x1f465);

            if (availableRoom.replaces && availableRoom.replaces.id !== Number(props.shiftId)) {
                const course = await Course.getById(availableRoom.replaces.course);
                const courseName = course.shortName;
                const shiftName = `${availableRoom.replaces.type}${availableRoom.replaces.number}`;

                return `${name} (${capacity} ${emoji}) - trocar com ${courseName} ${shiftName}`;
            } else {
                return `${name} (${capacity} ${emoji})`;
            }
        })
    );
});
</script>
