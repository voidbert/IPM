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
    <button
        :class="`shift shift-${props.type} ${props.horizontal ? 'shift-horizontal' : ''}`"
        :title="tooltip"
        :disabled="props.type.includes('disabled')">
        <div
            :class="{
                'shift-main-content': true,
                'shift-main-content-horizontal': props.horizontal
            }">
            <span>{{ props.course.shortName }}</span>
            <span>{{ props.shift.name }}</span>
            <span class="shift-room-text">{{ props.room.name }}</span>
        </div>
        <span v-if="props.showCapacity" class="shift-capacity">
            {{ props.attendence }} / {{ capacity }}
            <span class="shift-person-icon" />
        </span>
    </button>
</template>

<style scoped>
.shift {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    padding: 0.5em;
    border: none;
    border-radius: 0.5em;
    overflow: hidden;

    background-color: v-bind(`var(--color-shift-background-${color}) `);
    color: var(--color-shift-foreground);

    transition:
        background-color 0.1s,
        border-color 0.1s;
}

.shift-horizontal {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.shift-active:hover {
    background-color: v-bind(`var(--color-shift-background-${color}-hover) `);
}

.shift-border {
    background-color: var(--color-shift-background-disabled);
    border: 0.5em solid v-bind(`var(--color-shift-background-${color}) `);
}

.shift-border:hover {
    border-color: v-bind(`var(--color-shift-background-${color}-hover) `);
}

.shift-disabled {
    background-color: var(--color-shift-background-disabled);
}

.shift-disabled-dark {
    color: var(--color-shift-foreground-disabled-dark);
    background-color: var(--color-shift-background-disabled-highlighted);
}

.shift-disabled-selected {
    background-color: v-bind(`var(--color-shift-background-${color}-hover) `);
    box-shadow: inset 5px 5px 1px hsla(0, 0%, 0%, 20%);
}

.shift-main-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.shift-main-content-horizontal {
    flex-direction: row;
    gap: 0.3em;
}

.shift-main-content-horizontal .shift-room-text {
    margin-top: 0px;
    margin-left: 1em;
}

.shift-room-text {
    font-size: 0.75em;
    margin-top: 0.5em;

    white-space: nowrap;
    overflow: hidden;
}

.shift-capacity {
    display: flex;
    justify-content: flex-end;

    white-space: nowrap;
    overflow: hidden;

    gap: 0.5em;
    font-size: 0.75em;
}

.shift-person-icon {
    width: 1.3em;
    height: 1.3em;

    background-color: var(--color-shift-foreground);
    mask-image: url("/person-no-circle.svg");
    mask-size: cover;
}
</style>

<script setup lang="ts">
import { Business } from "../models/Business.ts";
import { Course } from "../models/Course.ts";
import { Shift } from "../models/Shift.ts";
import { Room } from "../models/Room.ts";

import { computed } from "vue";

export interface ScheduleShift {
    shift: Shift;
    course: Course;
    room: Room;
    type?: "active" | "border" | "disabled" | "disabled-dark" | "disabled-selected";
    showCapacity?: boolean;
    attendence?: number;
    horizontal?: boolean;
}

const props = withDefaults(defineProps<ScheduleShift>(), {
    type: "active",
    showCapacity: false,
    attendence: 0,
    horizontal: false
});

// @ts-expect-error TypeScript doesn't see this is used in the CSS
const color = computed(() => String(props.course.id).slice(-1));
const capacity = computed(() => Business.getShiftCapacity(props.shift, props.course, props.room));
const tooltip = computed(() => `${props.course.name} – ${props.shift.name} [${props.room.name}]`);
</script>
