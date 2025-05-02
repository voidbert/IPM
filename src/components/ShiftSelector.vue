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
    <div v-if="props.modelValue.initialized" class="shift-selector">
        <template v-for="course in presentedShifts" :key="course.course.id">
            <details
                class="shift-selector-details"
                :open="props.modelValue.openCourses[course.course.id]"
                @toggle="(e) => toggleCourse(e, course.course.id)">
                <summary class="shift-selector-summary">
                    <Checkbox
                        class="checkbox"
                        :modelValue="courseCheckboxValue(course.shifts)"
                        @input.prevent="handleCourseInput(course.shifts)">
                        {{ course.course.shortName }}
                    </Checkbox>
                </summary>
                <ul class="shift-selector-list">
                    <li v-for="shift in course.shifts" :key="shift.id">
                        <Checkbox v-model="props.modelValue.selectedShifts[shift.id]">
                            {{ shift.name }}
                        </Checkbox>
                    </li>
                </ul>
            </details>
        </template>
    </div>
</template>

<style scoped>
.shift-selector {
    display: flex;
    flex-direction: column;
    padding: 1em;
}

.shift-selector-title {
    display: block;
}

.shift-selector-summary {
    display: flex;
    align-items: center;
    gap: 0.5em;
}

.shift-selector-summary::-webkit-details-marker {
    display: none;
}

.shift-selector-summary::before {
    content: "▶";
    color: var(--color-body-foreground);
    transition:
        color 0.2s,
        transform 0.1s;
    transform: scale(0.6);
}

.shift-selector-details:open .shift-selector-summary::before {
    transform: rotate(90deg) scale(0.6);
}

.shift-selector-list {
    list-style-type: none;
    margin-top: 0.5em;
}

.shift-selector-details:open summary:hover:not(:has(.checkbox:hover))::before {
    transform: rotate(90deg) scale(0.95);
}

.shift-selector-details:not(open) summary:hover:not(:has(.checkbox:hover))::before {
    transform: scale(0.95);
}
</style>

<script setup lang="ts">
import Checkbox from "./Checkbox.vue";

import { Course } from "../models/Course.ts";
import { Shift } from "../models/Shift.ts";

import { computed } from "vue";

const props = defineProps<{
    courses: Course[];
    shifts: Shift[];

    // An hack to get an deep reactive model. This is actually how Vue compiles models.
    /* eslint vue/no-mutating-props: 0 */
    modelValue: {
        initialized: boolean;
        selectedShifts: Record<string, boolean>;
        openCourses: Record<string, boolean>;
    };
}>();

const presentedShifts = computed(() =>
    props.courses
        .map((course) => ({
            course: course,
            shifts: props.shifts.filter((shift) => shift.course === course.id)
        }))
        .sort((c1, c2) => c1.course.shortName.localeCompare(c2.course.shortName))
);

const courseCheckboxValue = (shifts: Shift[]) => {
    const shiftIds = shifts.map((shift) => String(shift.id));
    const selected = Object.entries(props.modelValue.selectedShifts).filter(
        (entry) => shiftIds.includes(entry[0]) && entry[1]
    ).length;

    if (selected == 0) {
        return false;
    } else if (selected === shifts.length) {
        return true;
    } else {
        return null;
    }
};

const toggleCourse = (e: ToggleEvent, courseId: number) => {
    if ((e.target as HTMLDetailsElement).open != props.modelValue.openCourses[courseId]) {
        props.modelValue.openCourses[courseId] = !props.modelValue.openCourses[courseId];
    }
};

const handleCourseInput = (shifts: Shift[]) => {
    let selected = courseCheckboxValue(shifts);
    if (selected === null) {
        selected = true;
    }

    shifts.forEach((shift) => {
        props.modelValue.selectedShifts[String(shift.id)] = !selected;
    });
};
</script>
