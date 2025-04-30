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
    <div id="complete-schedule-page-container">
        <aside id="complete-schedule-sidebar">
            <h1 id="complete-schedule-sidebar-title">Turnos</h1>
            <ShiftSelector
                v-model="shiftSelectorStore"
                :courses="studentCourses"
                :shifts="studentShifts" />
        </aside>

        <main id="complete-schedule-main">
            <span id="complete-schedule-tip">
                <template v-if="!choosing">Clique num turno para mais informação</template>
                <template v-else>Clique num turno para realizar a sua troca</template>
            </span>
            <Button
                v-if="choosing"
                id="complete-schedule-cancel"
                type="cancel"
                @click="choosing = undefined">
                Cancelar
            </Button>

            <div id="complete-schedule-schedule-container">
                <Schedule :shifts="scheduleShifts" @clickShift="handleShiftClick" />
            </div>
        </main>
    </div>

    <!-- v-if necessary to avoid warnings about undefined properties -->
    <ShiftInfoPopup
        v-if="showShiftInfo"
        v-model="showShiftInfo"
        v-bind="shiftInfo as ShiftInfo"
        @accept="startChange()" />
    <ShiftChangePopup
        v-if="changeShiftOriginal && changeShiftReplacement && changeShiftCourse"
        v-model="showShiftChange"
        :original="changeShiftOriginal"
        :replacement="changeShiftReplacement"
        :course="changeShiftCourse"
        @accept="sendRequest()" />
    <Toast v-model="showToast"> Pedido de troca realizado com sucesso </Toast>
</template>

<style scoped>
#complete-schedule-page-container {
    display: flex;
    flex: 1 0 0;
    overflow: scroll;
}

#complete-schedule-sidebar {
    min-width: 15em;
    display: flex;
    flex-direction: column;
    overflow: scroll;
}

#complete-schedule-sidebar-title {
    margin: 0em 1em 0.5em 0.5em;
    padding: 0.5em;
    border-bottom: 1px solid var(--color-body-foreground);

    font-size: 1.2em;
}

#complete-schedule-main {
    position: relative;
    display: flex;
    padding: 1rem;

    overflow: scroll;
}

#complete-schedule-tip {
    position: absolute;
    top: 1em;
    left: 50%;
    transform: translateX(-50%);

    white-space: nowrap;
    overflow: hidden;

    font-weight: bold;
}

#complete-schedule-cancel {
    position: absolute;
    top: 0.5em; /* Hardcoded navbar height */
    left: 1em;
}

#complete-schedule-schedule-container {
    display: flex;
    flex-direction: column; /* For horizontal schedule growth */
    flex: 1 0 0;
    margin-top: 3rem;
}
</style>

<script setup lang="ts">
import Button from "../components/Button.vue";
import { ScheduleShift } from "../components/PresentedShift.vue";
import Schedule from "../components/Schedule.vue";
import ShiftChangePopup from "../components/ShiftChangePopup.vue";
import { ShiftInfo } from "../components/ShiftInfoPopup.vue";
import ShiftInfoPopup from "../components/ShiftInfoPopup.vue";
import ShiftSelector from "../components/ShiftSelector.vue";
import Toast from "../components/Toast.vue";

import { useLoginStore } from "../stores/login.ts";
import { useShiftSelectorStore } from "../stores/shiftSelector.ts";
import { Course } from "../models/Course.ts";
import { Room } from "../models/Room.ts";
import { Shift, ShiftType } from "../models/Shift.ts";
import { User } from "../models/User.ts";

import { computed, ref } from "vue";

// Load page state
const loginStore = useLoginStore();
const users = ref<User[]>([]);
const shifts = ref<Shift[]>([]);
const courses = ref<Course[]>([]);
const rooms = ref<Room[]>([]);

const studentCourses = ref<Course[]>([]);
const studentShifts = ref<Shift[]>([]);

const shiftSelectorStore = useShiftSelectorStore();

Promise.all([User.getAll(), Shift.getAll(), Course.getAll(), Room.getAll()]).then((res) => {
    users.value = res[0];
    shifts.value = res[1];
    courses.value = res[2];
    rooms.value = res[3];

    const student = users.value.find((u) => u.email === (loginStore.email as string)) as User;
    studentCourses.value = courses.value.filter((course) =>
        student.enrollments.includes(course.id)
    );
    studentShifts.value = shifts.value.filter((shift) =>
        student.enrollments.includes(shift.course)
    );

    if (!shiftSelectorStore.initialized) {
        shiftSelectorStore.selectedShifts = Object.fromEntries(
            studentShifts.value.map((shift) => [String(shift.id), true])
        );

        shiftSelectorStore.openCourses = Object.fromEntries(
            studentCourses.value.map((course) => [String(course.id), true])
        );

        shiftSelectorStore.initialized = true;
    }
});

const scheduleShifts = computed(() => {
    const ret: ScheduleShift[] = [];
    const student = users.value.find((u) => u.email === (loginStore.email as string)) as User;
    if (!(student instanceof User)) return [];

    // Selected shifts
    shifts.value
        .filter((shift) => shiftSelectorStore.selectedShifts[String(shift.id)])
        .forEach((shift) => {
            const course = courses.value.find((c) => c.id === shift.course) as Course;
            const room = rooms.value.find((r) => r.id === shift.room) as Room;

            ret.push({
                shift: shift,
                course: course,
                room: room
            });
        });

    // Add extra shifts when choosing a shift
    if (choosing.value) {
        shifts.value.forEach((shift) => {
            const [courseId, shiftType] = choosing.value as [number, ShiftType];
            const course = courses.value.find((c) => c.id === shift.course) as Course;
            const room = rooms.value.find((r) => r.id === shift.room) as Room;

            // Shifts of the desired type
            if (
                (course.id === courseId && shift.type === shiftType) ||
                student.committedSchedule.includes(shift.id)
            ) {
                const found = ret.find((s) => s.shift.id === shift.id);
                if (found) {
                    return;
                }

                ret.push({
                    shift: shift,
                    course: course,
                    room: room
                });
            }
        });
    }

    ret.forEach((pshift) => {
        const studentShift = student.committedSchedule.includes(pshift.shift.id);

        if (choosing.value) {
            const [courseId, shiftType] = choosing.value as [number, ShiftType];

            if (pshift.shift.course === courseId && pshift.shift.type === shiftType) {
                pshift.type = studentShift ? "disabled-selected" : "active";
            } else {
                pshift.type = studentShift ? "disabled-dark" : "disabled";
            }
        } else {
            pshift.type = studentShift ? "active" : "border";
        }
    });

    return ret;
});

// Input handling
const showShiftInfo = ref(false);
const shiftInfo = ref<ShiftInfo>();

const choosing = ref<[number, ShiftType]>();

const showShiftChange = ref(false);
const changeShiftOriginal = ref<Shift>();
const changeShiftReplacement = ref<Shift>();
const changeShiftCourse = ref<Course>();

const showToast = ref(false);

const handleShiftClick = (shift: ScheduleShift) => {
    if (choosing.value) {
        // Open shift change confirmation popup
        const student = users.value.find((u) => u.email === (loginStore.email as string)) as User;
        const originalShift = student.committedSchedule.find((shiftId) => {
            const shift = shifts.value.find((s) => s.id === shiftId) as Shift;
            const [courseId, shiftType] = choosing.value as [number, ShiftType];
            return shift.course === courseId && shift.type === shiftType;
        });

        changeShiftOriginal.value = shifts.value.find((s) => s.id === originalShift) as Shift;
        changeShiftReplacement.value = shift.shift;
        changeShiftCourse.value = shift.course;

        showShiftChange.value = true;
    } else {
        // Open shift info popup
        const attendence = users.value.filter((u) =>
            u.committedSchedule.includes(shift.shift.id)
        ).length;

        const changePossible =
            shifts.value.filter(
                (s) => s.type === shift.shift.type && s.course === shift.shift.course
            ).length > 1;

        shiftInfo.value = {
            shift: shift.shift,
            course: shift.course,
            room: shift.room,
            professor: users.value.find((u) => u.id === shift.shift.professor) as User,
            attendence: attendence,
            changePossible: changePossible
        };
        showShiftInfo.value = true;
    }
};

const startChange = () => {
    choosing.value = [
        (shiftInfo.value as ShiftInfo).course.id,
        (shiftInfo.value as ShiftInfo).shift.type
    ];
};

const sendRequest = () => {
    // TODO - send request
    choosing.value = undefined;
    showToast.value = true;
};
</script>
