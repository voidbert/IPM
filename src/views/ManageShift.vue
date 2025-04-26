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
            <Button id="manage-shift-back-button" type="cancel" @click="router.go(-1)">
                Voltar
            </Button>

            <h1>{{ course.shortName }} – {{ shift.type }}{{ shift.number }}</h1>
            <h2>{{ shift.prettyDay }}, {{ shift.prettyStart }} – {{ shift.prettyEnd }}</h2>
            <h3>Docente: {{ professor.name }}</h3>

            <DropdownMenu
                id="manage-shift-room-dropdown"
                label="Sala"
                :options="roomNames"
                v-model="selectedRoom"
                v-on:update:modelValue="changeRoom()" />
        </div>

        <div id="manage-shift-management-container">
            <div id="manage-shift-management">
                <div id="manage-shift-first-row">
                    <span
                        id="manage-shift-attendence"
                        v-if="shift"
                        :class="
                            allStudents.length > shiftCapacity ? 'manage-shift-attendence-over' : ''
                        ">
                        Lotação: {{ allStudents.length }} / {{ shiftCapacity }}
                        <span class="manage-shift-person-icon" />
                    </span>
                    <Button id="manage-shift-add-student">Adicionar aluno</Button>
                </div>
                <TextInput
                    type="search"
                    placeholder="Pesquisar"
                    v-model="studentsSearch"
                    v-on:update:modelValue="updateStudentListWidth" />

                <div id="manage-shift-students">
                    <PresentedStudent
                        v-for="(student, i) in shownStudents"
                        :key="i"
                        :student="student" />
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
#manage-shift-page-container {
    display: flex;
    flex: 1 0 0;
    padding: 1rem;
}

#manage-shift-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

#manage-shift-back-button {
    width: 10rem;
    margin-bottom: 1rem !important;
}

#manage-shift-info > * {
    margin: 0px;
}

#manage-shift-info > h3 {
    font-weight: normal;
    margin-bottom: 1rem;
}

#manage-shift-management-container {
    display: flex;
    justify-content: center;
    flex-grow: 1;
}

#manage-shift-management {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

#manage-shift-first-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#manage-shift-attendence {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.manage-shift-attendence-over {
    --color-body-foreground: var(--color-uminho);
    color: var(--color-body-foreground);
}

.manage-shift-person-icon {
    width: 1.3rem;
    height: 1.3rem;

    background-color: var(--color-body-foreground);
    mask-image: url("/person-no-circle.svg");
    mask-size: cover;
}

#manage-shift-add-student {
    width: 10rem;
}

#manage-shift-students {
    width: v-bind(fixedStudentListWidth);

    display: flex;
    flex-direction: column;
    flex: 1 0 0;

    overflow: hidden scroll;
}
</style>

<script setup lang="ts">
import Button from "../components/Button.vue";
import DropdownMenu from "../components/DropdownMenu.vue";
import PresentedStudent from "../components/PresentedStudent.vue";
import TextInput from "../components/TextInput.vue";

import { Business } from "../models/Business.ts";
import { Course } from "../models/Course.ts";
import { AvailableRoom, Room } from "../models/Room.ts";
import { Shift } from "../models/Shift.ts";
import { User } from "../models/User.ts";

import { computed, ref } from "vue";
import { useRouter } from "vue-router";

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

const router = useRouter();

const changeRoom = () => {
    if (shift.value && rooms.value.length > 0) {
        const room = rooms.value[selectedRoom.value] as AvailableRoom;
        shift.value.room = room.room.id;
        shift.value.update();
    }
};

// Student list
const shiftCapacity = ref(0);

const allStudents = ref<User[]>([]);
const studentsSearch = ref("");
const shownStudents = computed(() => {
    return allStudents.value.filter((student) =>
        student.name.toLowerCase().includes(studentsSearch.value.toLowerCase())
    );
});

// Load page state
Shift.getById(Number(props.shiftId)).then(async (s) => {
    if (!s) return;
    shift.value = s;

    const [rawCourse, rawRoom, allUsers] = await Promise.all([
        Course.getById(shift.value.course),
        Room.getById(shift.value.room),
        User.getAll()
    ]);

    course.value = rawCourse as Course;

    const shiftRoom = rawRoom as Room;
    if ((shift.value as Shift).type === "T") {
        shiftCapacity.value = shiftRoom.capacity;
    } else {
        shiftCapacity.value = Math.min(shiftRoom.capacity, course.value.practicalShiftCapacity);
    }

    professor.value = allUsers.find((u) => u.id === (shift.value as Shift).professor) as User;
    allStudents.value = allUsers.filter((u) => u.directorSchedule.includes(Number(props.shiftId)));
});

Business.getAlternativeRooms(Number(props.shiftId)).then(async (alternatives) => {
    rooms.value = alternatives;

    const courses = await Course.getAll();
    roomNames.value = rooms.value.map((availableRoom) => {
        const name = availableRoom.room.name;
        const capacity = availableRoom.room.capacity;
        const emoji = String.fromCodePoint(0x1f465);

        if (availableRoom.replaces && availableRoom.replaces.id !== Number(props.shiftId)) {
            const course = courses.find(
                (c) => c.id === (availableRoom.replaces as Shift).course
            ) as Course;
            const courseName = course.shortName;
            const shiftName = `${availableRoom.replaces.type}${availableRoom.replaces.number}`;

            return `${name} (${capacity} ${emoji}) - trocar com ${courseName} ${shiftName}`;
        } else {
            return `${name} (${capacity} ${emoji})`;
        }
    });
});

// Always keep the student list's width the same, despite the elements actually being shown
const fixedStudentListWidth = ref("auto");
const updateStudentListWidth = () => {
    if (!fixedStudentListWidth.value) {
        fixedStudentListWidth.value = getComputedStyle(
            document.getElementById("manage-shift-students") as HTMLElement
        ).width;
    }
};
</script>
