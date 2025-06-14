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

            <h1>{{ course.shortName }} – {{ shift.name }}</h1>
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
                    <UndoButton :disabled="undoHistory.length == 0" @click="undo()" />
                    <Capacity :attendence="shiftStudents.length" :capacity="shiftCapacity" />
                    <Button
                        :type="otherStudents.length > 0 ? 'action' : 'disabled'"
                        reasonDisabled="Todos os alunos inscritos nesta UC estão neste turno"
                        id="manage-shift-add-student"
                        @click="popupVisible = true">
                        Adicionar aluno
                    </Button>
                </div>
                <StudentList :students="shiftStudents" type="remove" @act="removeStudent" />
            </div>
        </div>

        <Popup v-model="popupVisible">
            <div id="manage-shift-management-popup-content">
                <h1 id="manage-shift-management-popup-title">Adicionar aluno</h1>
                <StudentList :students="otherStudents" type="add" @act="addStudent" />
            </div>
        </Popup>
    </main>
</template>

<style scoped>
#manage-shift-page-container {
    display: flex;
    flex: 1 0 0;
    padding: 1em;
}

#manage-shift-info {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
}

#manage-shift-back-button {
    width: 10em;
    margin-bottom: 1em !important;
}

#manage-shift-info > * {
    margin: 0px;
}

#manage-shift-info > h3 {
    font-weight: normal;
    margin-bottom: 1em;
}

#manage-shift-management-container {
    display: flex;
    justify-content: center;
    flex-grow: 1;
}

#manage-shift-management {
    display: flex;
    flex-direction: column;
    gap: 1em;
}

#manage-shift-first-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#manage-shift-add-student {
    width: 10em;
}

#manage-shift-management-popup-content {
    height: 80vh;
    display: flex;
    flex-direction: column;
    gap: 1em;
}

#manage-shift-management-popup-title {
    margin: 0px;
    font-size: 1.5em;
    text-align: center;
}
</style>

<script setup lang="ts">
import Button from "../components/Button.vue";
import Capacity from "../components/Capacity.vue";
import DropdownMenu from "../components/DropdownMenu.vue";
import Popup from "../components/Popup.vue";
import StudentList from "../components/StudentList.vue";
import UndoButton from "../components/UndoButton.vue";

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
const shift = ref<Shift>();
const course = ref<Course>();
const professor = ref<User>();
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

const shiftStudents = computed(() =>
    allStudents.value.filter((user) => user.directorSchedule.includes(Number(props.shiftId)))
);

const removeStudent = async (student: User) => {
    student.directorSchedule = student.directorSchedule.filter(
        (s) => s !== (shift.value as Shift).id
    );
    await student.update();

    undoHistory.value.push({
        type: "remove",
        student: student
    });
};

// Popup
const allShifts = ref<Shift[]>([]);
const popupVisible = ref(false);

const otherStudents = computed(() =>
    allStudents.value.filter(
        (user) =>
            user.enrollments.includes((course.value as Course).id) &&
            !user.directorSchedule.includes(Number(props.shiftId))
    )
);

const addStudent = async (student: User) => {
    const replacingShift = student.directorSchedule.find((shiftId) => {
        const shiftObj = allShifts.value.find((s) => s.id === shiftId) as Shift;
        return (
            shiftObj.course === (course.value as Course).id &&
            shiftObj.type === (shift.value as Shift).type
        );
    });

    if (replacingShift !== undefined) {
        student.directorSchedule = student.directorSchedule.filter((s) => s !== replacingShift);
    }

    student.directorSchedule.push((shift.value as Shift).id);
    await student.update();
    popupVisible.value = false;

    undoHistory.value.push({
        type: "add",
        student: student,
        replacedShiftId: replacingShift
    });
};

// Undo
interface UndoItem {
    type: "add" | "remove";
    student: User;
    replacedShiftId?: number;
}

const undoHistory = ref<UndoItem[]>([]);
const undo = async () => {
    const item = undoHistory.value.pop() as UndoItem;

    if (item.type === "add") {
        if (item.replacedShiftId !== undefined) {
            item.student.directorSchedule.push(item.replacedShiftId);
        }

        item.student.directorSchedule = item.student.directorSchedule.filter(
            (s) => s !== (shift.value as Shift).id
        );
    } else if (item.type === "remove") {
        item.student.directorSchedule.push((shift.value as Shift).id);
    }

    await item.student.update();
};

document.addEventListener("keyup", (e) => {
    if (undoHistory.value.length > 0 && e.ctrlKey && (e.key === "z" || e.key == "Z")) {
        undo();
    }
});

// Load page state
Shift.getAll().then(async (ss) => {
    allShifts.value = ss;
    shift.value = ss.find((s) => s.id === Number(props.shiftId)) as Shift;

    const [rawCourse, rawRoom, allUsers] = await Promise.all([
        Course.getById(shift.value.course),
        Room.getById(shift.value.room),
        User.getAll()
    ]);

    course.value = rawCourse as Course;
    shiftCapacity.value = Business.getShiftCapacity(
        shift.value as Shift,
        course.value as Course,
        rawRoom as Room
    );
    professor.value = allUsers.find((u) => u.id === (shift.value as Shift).professor) as User;
    allStudents.value = allUsers;
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
</script>
