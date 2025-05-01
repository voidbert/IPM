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
    <div id="solve-problems-page-container" v-if="allProblems.length > 0">
        <aside id="solve-problems-sidebar" ref="sidebar">
            <TextInput
                type="search"
                placeholder="Pesquisar"
                v-model="problemSearch"
                v-on:update:modelValue="updateSideBarWidth" />

            <div id="solve-problems-sidebar-problems" v-if="courses.length > 0">
                <div
                    class="solve-problems-problem-container"
                    v-for="(problem, i) in allProblems"
                    :key="i">
                    <PresentedProblem
                        v-if="mustShowProblem(problem)"
                        :active="i === activeProblem"
                        :problem="problem"
                        :description="describe(problem)"
                        @click="activeProblem = i" />
                </div>
            </div>
        </aside>

        <main id="solve-problems-main">
            <UndoButton :disabled="undoHistory.length == 0" @click="undo()" />
            <Schedule :shifts="scheduleShifts" @clickShift="handleShiftClick" />
            <Button
                id="solve-problem-refuse-button"
                v-if="(allProblems[activeProblem] as Problem).type === 'request'"
                @click="confirmRefusal = true">
                Recusar
            </Button>
        </main>
    </div>
    <div id="solve-problems-empty" v-else>
        <UndoButton v-if="undoHistory.length > 0" @click="undo()" />
        Sem problemas por resolver
    </div>

    <Popup v-model="fullShift">
        <div id="solve-problems-full-shift-content">
            <span id="solve-problems-full-shift-message">Este turno está cheio</span>

            <div id="solve-problems-full-shift-buttons">
                <Button type="cancel" @click="fullShift = false">Cancelar</Button>
                <Button
                    :type="swapRoomButtonType"
                    reasonDisabled="O fator limitante da capacidade deste turno não é a sua sala"
                    @click="swapRoom()">
                    Trocar de sala
                </Button>
                <Button @click="swapShift()">Adicionar mesmo assim</Button>
            </div>
        </div>
    </Popup>

    <Popup v-model="confirmRefusal">
        <div id="solve-problems-confirm-refusal-content">
            <span id="solve-problems-confirm-refusal-question">Deseja recusar este pedido?</span>
            <span>Não será possível desfazer esta ação</span>

            <div id="solve-problems-confirm-refusal-buttons">
                <Button type="cancel" @click="confirmRefusal = false">Não</Button>
                <Button @click="refuse()">Sim</Button>
            </div>
        </div>
    </Popup>

    <Toast :model-value="toastsStore.successfulSchedulePublishing">
        Horários publicados com sucesso!
    </Toast>
</template>

<style scoped>
#solve-problems-page-container,
#solve-problems-empty {
    flex: 1 0 0;
}

#solve-problems-page-container {
    display: flex;

    gap: 1em;
}

#solve-problems-sidebar {
    flex: 0 0 v-bind(fixedSideBarWidth);
    display: flex;
    flex-direction: column;

    gap: 0.5em;
    padding: 0.5em 0em 0.5em 0.5em;
}

#solve-problems-sidebar-problems {
    display: flex;
    flex: 1 0 0;
    flex-direction: column;

    overflow: hidden scroll;
}

#solve-problems-main {
    display: flex;
    flex-direction: column;

    gap: 0.5em;
    padding: 1em;

    overflow: scroll;
}

#solve-problems-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1em;
}

#solve-problems-full-shift-content,
#solve-problems-confirm-refusal-content {
    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 0.5em;
    gap: 1em;
}

#solve-problems-full-shift-message,
#solve-problems-confirm-refusal-question {
    font-size: 1.2em;
}

#solve-problems-full-shift-buttons,
#solve-problems-confirm-refusal-buttons {
    display: flex;
    gap: 0.5em;
}

#solve-problems-full-shift-buttons > *,
#solve-problems-confirm-refusal-buttons > * {
    width: 16em;
}
</style>

<script setup lang="ts">
import Button from "../components/Button.vue";
import Popup from "../components/Popup.vue";
import PresentedProblem from "../components/PresentedProblem.vue";
import { ScheduleShift } from "../components/PresentedShift.vue";
import Schedule from "../components/Schedule.vue";
import TextInput from "../components/TextInput.vue";
import Toast from "../components/Toast.vue";
import UndoButton from "../components/UndoButton.vue";

import { useToastsStore } from "../stores/toasts.ts";
import { Business } from "../models/Business.ts";
import { Course } from "../models/Course.ts";
import { Notification } from "../models/Notification.ts";
import { Problem } from "../models/Problem.ts";
import { Room } from "../models/Room.ts";
import { Shift } from "../models/Shift.ts";
import { User } from "../models/User.ts";

import { computed, ref, useTemplateRef } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
    problem?: string; // Must be a number casted to string (router limitations)
}>();

// State loading
const shifts = ref<Shift[]>([]);
const courses = ref<Course[]>([]);
const rooms = ref<Room[]>([]);
const users = ref<User[]>([]);
const notifications = ref<Notification[]>([]);

Promise.all([Shift.getAll(), Course.getAll(), Room.getAll(), User.getAll()]).then(async (res) => {
    shifts.value = res[0];
    courses.value = res[1];
    rooms.value = res[2];
    users.value = res[3];

    const director = users.value.find((u) => u.type === "director") as User;
    notifications.value = await Notification.getToUser(director.id);
});

// Sidebar
const allProblems = ref<Problem[]>([]);
Business.getProblems().then((problems) => {
    allProblems.value = problems;
});

const problemSearch = ref("");
const activeProblem = ref(Number(props.problem) || 0);
const mustShowProblem = (problem: Problem) => {
    const searchString = problemSearch.value.toLowerCase();
    return (
        problem.student.name.toLowerCase().includes(searchString) ||
        (problem.student.number as string).toLowerCase().includes(searchString) ||
        describe(problem).toLowerCase().includes(searchString)
    );
};

const describe = (problem: Problem): string => {
    const course = courses.value.find((c) => c.id === problem.courseId) as Course;
    if (problem.type === "unassignedShift") {
        return `${course.shortName} ${problem.shiftType} (por atribuir)`;
    } else {
        return `${course.shortName} ${(problem.originalShift as Shift).name} → ${(problem.replacementShift as Shift).name}`;
    }
};

// Always keep the sidebar's width the same, despite the elements actually being shown
const fixedSideBarWidth = ref("auto");
const sidebar = useTemplateRef("sidebar");
const updateSideBarWidth = () => {
    if (fixedSideBarWidth.value === "auto") {
        fixedSideBarWidth.value = getComputedStyle(sidebar.value as Element).width;
    }
};

// Schedule
const scheduleShifts = computed(() => {
    const ret: ScheduleShift[] = [];
    const problem = allProblems.value[activeProblem.value] as Problem;
    const student = problem.student;

    // Base student schedule
    student.committedSchedule.forEach((shiftId) => {
        const shift = shifts.value.find((s) => s.id === shiftId) as Shift;
        const course = courses.value.find((c) => c.id === shift.course) as Course;
        const room = rooms.value.find((r) => r.id === shift.room) as Room;

        ret.push({
            shift: shift,
            course: course,
            room: room,
            type: "disabled"
        });
    });

    // Add extra shifts when choosing a shift
    shifts.value.forEach((shift) => {
        if (shift.course === problem.courseId && shift.type === problem.shiftType) {
            const attendence = users.value.filter((u) =>
                u.directorSchedule.includes(shift.id)
            ).length;

            const found = ret.find((s) => s.shift.id === shift.id);
            if (found) {
                found.type = "disabled-selected";
                found.attendence = attendence;
                found.showCapacity = true;
                return;
            }

            const course = courses.value.find((c) => c.id === shift.course) as Course;
            const room = rooms.value.find((r) => r.id === shift.room) as Room;
            const isGoal = problem.replacementShift
                ? shift.id === problem.replacementShift.id
                : true;

            ret.push({
                shift: shift,
                course: course,
                room: room,
                type: isGoal ? "active" : "border",
                attendence: attendence,
                showCapacity: true
            });
        }
    });

    return ret;
});

// Input handling
const fullShift = ref(false);
const swappingShift = ref<[Problem, ScheduleShift]>();

const handleShiftClick = async (shift: ScheduleShift) => {
    const problem = allProblems.value[activeProblem.value] as Problem;
    const capacity = Business.getShiftCapacity(shift.shift, shift.course, shift.room);
    swappingShift.value = [problem, shift];

    if ((shift.attendence as number) < capacity) {
        await swapShift();
    } else {
        fullShift.value = true;
    }
};

const swapShift = async () => {
    const [problem, shift] = swappingShift.value as [Problem, ScheduleShift];

    const replacingShift = problem.student.directorSchedule.find((shiftId) => {
        const shiftObj = shifts.value.find((s) => s.id === shiftId) as Shift;
        return shiftObj.course === shift.shift.course && shiftObj.type === shift.shift.type;
    });

    if (replacingShift !== undefined) {
        problem.student.directorSchedule = problem.student.directorSchedule.filter(
            (s) => s !== replacingShift
        );
    }

    problem.student.directorSchedule.push(shift.shift.id);
    await problem.student.update();
    undoHistory.value.push([problem, shift]);

    fullShift.value = false;
    allProblems.value.splice(activeProblem.value, 1);
    if (activeProblem.value === allProblems.value.length) {
        activeProblem.value--;
    }
};

const router = useRouter();
const swapRoom = () => {
    router.push(`/ManageShifts/${(swappingShift.value as [Problem, ScheduleShift])[1].shift.id}`);
};

const confirmRefusal = ref(false);
const refuse = async () => {
    const problem = allProblems.value[activeProblem.value] as Problem;
    const notification = notifications.value.find(
        (notification) =>
            notification.from === problem.student.id &&
            notification.fromShift === (problem.originalShift as Shift).id &&
            notification.toShift === (problem.replacementShift as Shift).id
    ) as Notification;

    notification.state = "rejected";
    await notification.update();

    confirmRefusal.value = false;
    allProblems.value.splice(activeProblem.value, 1);
    if (activeProblem.value === allProblems.value.length) {
        activeProblem.value--;
    }
};

// Undo
type UndoItem = [Problem, ScheduleShift];
const undoHistory = ref<UndoItem[]>([]);

const undo = async () => {
    const [problem, shift] = undoHistory.value.pop() as UndoItem;

    if (problem.originalShift !== undefined) {
        problem.student.directorSchedule.push(problem.originalShift.id);
    }
    problem.student.directorSchedule = problem.student.directorSchedule.filter(
        (s) => s !== shift.shift.id
    );
    await problem.student.update();

    allProblems.value.push(problem);
    allProblems.value.sort((p1, p2) => p1.id - p2.id);

    for (let i = 0; i < allProblems.value.length; ++i) {
        if ((allProblems.value[i] as Problem).id === problem.id) {
            activeProblem.value = i;
            break;
        }
    }
};

document.addEventListener("keyup", (e) => {
    if (undoHistory.value.length > 0 && e.ctrlKey && (e.key === "z" || e.key == "Z")) {
        undo();
    }
});

// Popups
const swapRoomButtonType = computed(() => {
    const shift = (swappingShift.value as [Problem, ScheduleShift])[1];
    const reason = Business.getShiftCapacityReason(shift.shift, shift.course, shift.room);

    return reason === "room" ? "action" : "disabled";
});

// Toast
const toastsStore = useToastsStore();
</script>
