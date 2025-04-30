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
    <table class="schedule">
        <thead>
            <tr>
                <th class="schedule-hour" />
                <th class="schedule-day schedule-cell" v-for="day in days" :key="day">{{ day }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(hour, h) in hours" :key="h">
                <th class="schedule-hour">{{ hour }}</th>
                <td class="schedule-cell" v-for="(_, d) in days" :key="d">
                    <PresentedShift
                        class="schedule-shift"
                        v-for="(shift, i) in hourShifts.get(makeKey(d, h + 8))"
                        :key="i"
                        v-bind="shift.shift"
                        :style="{
                            height: `${shift.shift.shift.duration * 100}%`,
                            width: `calc(${shift.width * 100}% - 0.1em)`,
                            left: `calc(${shift.position * (1 / shift.occupancy) * 100}% + 0.05em)`,
                            top: `${(shift.shift.shift.start - Math.floor(shift.shift.shift.start)) * 100}%`
                        }"
                        :tabindex="shift.tabIndex"
                        @click="$emit('clickShift', shift.shift)" />
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped>
.schedule {
    table-layout: fixed;
    border-collapse: collapse;
    width: calc(max(100%, v-bind(`${maxOccupancy * (showCapacities ? 4.5: 3.5) * 5 + 3}em`)));
    flex: 1 0 calc(max(100%, v-bind(`${12 * (showCapacities ? 3: 2.5)}em`)));
}

.schedule-day {
    padding: 0px;

    font-weight: normal;
    color: var(--color-schedule-header-foreground);
    background-color: var(--color-schedule-header-background-1);
}

.schedule-hour {
    width: 3em;
    text-align: right;
    vertical-align: top;

    padding-right: 0.5em;
    font-size: 0.8em;
    font-weight: normal;
}

.schedule th:nth-child(odd):not(.schedule-hour) {
    background-color: var(--color-schedule-header-background-1);
}

.schedule th:nth-child(even) {
    background-color: var(--color-schedule-header-background-2);
}

.schedule-cell {
    position: relative;
}

.schedule-cell:not(.schedule-header) {
    border: 1px solid var(--color-schedule-header-background-2);
}

.schedule-shift {
    position: absolute;
    width: 100%;
    z-index: 1; /* Fix hover */
}
</style>

<script setup lang="ts">
import PresentedShift from "./PresentedShift.vue";
import { ScheduleShift } from "./PresentedShift.vue";

import { computed } from "vue";

const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
const hours = ["08h", "09h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h"];

const props = defineProps<{
    shifts: ScheduleShift[];
}>();

defineEmits<{
    (e: "clickShift", shift: ScheduleShift): void;
}>();

interface PositionedShift {
    shift: ScheduleShift;
    width: number;
    position: number;
    occupancy: number;
    tabIndex: number;
}

const makeKey = (day: number, hour: number) => {
    return day * 100 + hour;
};

// Shift layout
const minInterval = 0.5;

const computeOccupancies = (): [Map<number, number>, Map<number, ScheduleShift[]>] => {
    const occupancy = new Map<number, number>();
    const occupancyShifts = new Map<number, ScheduleShift[]>();

    // Determine occupied intervals
    props.shifts.forEach((shift) => {
        for (let t = shift.shift.start; t < shift.shift.end; t += minInterval) {
            const key = makeKey(shift.shift.day, t);

            occupancy.set(key, (occupancy.get(key) || 0) + 1);

            const shiftsArray = occupancyShifts.get(key) || [];
            shiftsArray.push(shift);
            occupancyShifts.set(key, shiftsArray);
        }
    });

    // Expand occupancy to overlapping shifts
    props.shifts.forEach((shift) => {
        let maxOccupancy = 1;

        for (let t = shift.shift.start; t < shift.shift.end; t += minInterval) {
            const key = makeKey(shift.shift.day, t);

            if ((occupancy.get(key) as number) > maxOccupancy) {
                maxOccupancy = occupancy.get(key) as number;
            }
        }

        for (let t = shift.shift.start; t < shift.shift.end; t += minInterval) {
            const key = makeKey(shift.shift.day, t);
            occupancy.set(key, maxOccupancy);
        }
    });

    return [occupancy, occupancyShifts];
};

const hourShifts = computed(() => {
    const [occupancy, occupancyShifts] = computeOccupancies();

    const ret = new Map<number, PositionedShift[]>();
    const visitedShifts = new Set<number>();
    const spaceOccupancy = new Map(
        [...occupancy.keys()].map((key) => [key, Array(occupancy.get(key)).fill(false)])
    );

    let tabIndex = 1;
    [...occupancyShifts.entries()]
        .sort((a, b) => a[0] - b[0])
        .forEach((entry) => {
            const [key, shifts] = entry;

            shifts.forEach((shift) => {
                // Don't repeat the same shift multiple times
                if (visitedShifts.has(shift.shift.id)) {
                    return;
                } else {
                    visitedShifts.add(shift.shift.id);
                }

                // Position shift
                const hour = Math.floor(shift.shift.start);
                const retKey = makeKey(shift.shift.day, hour);

                let position = 0;
                for (; position < (occupancy.get(key) || 1); ++position) {
                    // Look for a position that won't overlap other shifts
                    let valid = true;
                    for (let t = shift.shift.start; t < shift.shift.end; t += minInterval) {
                        const key = makeKey(shift.shift.day, t);

                        if ((spaceOccupancy.get(key) as boolean[])[position]) {
                            valid = false;
                            break;
                        }
                    }

                    if (valid) {
                        // Claim position
                        for (let t = shift.shift.start; t < shift.shift.end; t += minInterval) {
                            const key = makeKey(shift.shift.day, t);
                            (spaceOccupancy.get(key) as boolean[])[position] = true;
                        }
                        break;
                    }
                }

                const shiftsList = ret.get(retKey) || [];
                shiftsList.push({
                    shift: shift,
                    width: 1 / (occupancy.get(key) as number),
                    position: position,
                    occupancy: occupancy.get(key) as number,
                    tabIndex: tabIndex++
                });
                shift.horizontal = shift.shift.duration <= 1.5;
                ret.set(retKey, shiftsList);
            });
        });

    return ret;
});

// @ts-expect-error TypeScript doesn't see this is used in the CSS
const maxOccupancy = computed(() =>
    Math.max.apply(null, [...computeOccupancies()[0].values()].concat([0]))
);

// @ts-expect-error TypeScript doesn't see this is used in the CSS
const showCapacities = computed(() => props.shifts.some((shift) => shift.showCapacity));
</script>
