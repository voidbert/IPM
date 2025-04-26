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
    <table class="reset week-schedule">
        <thead class="reset hours-column">
            <tr class="reset empty-hour header-cell center">
                <td>h</td>
            </tr>
            <tr class="reset hour-cell" v-for="h in hours_string" :key="h">
                <td>{{ h }}h00</td>
            </tr>
        </thead>
        <tbody class="reset week-columns">
            <table class="reset day-column" v-for="(d, index) in days" :key="index">
                <thead class="reset day-header header-cell center">
                    <tr>
                        {{
                            d
                        }}
                    </tr>
                </thead>
                <li
                    class="reset shift-block center"
                    v-for="[l, w, s] in props.shifts[index]"
                    :key="s.id"
                    :style="{
                        top: `calc(2rem + ${(s.start - 8) * 7.92}%)`,
                        left: `${l * 100}%`,
                        height: `calc(((100% - (2rem)) / 12) * ${s.end - s.start})`,
                        width: `${w * 100}%`
                    }">
                    <ShiftItem :shift_info="getShiftInfo(s)" />
                    <!--                            <span v-for="s in sb.shifts" :key="s.name">{{ s.name }}</span>-->
                    <!--                            <ShiftBlock :shifts_info="getShiftsFromBlock(sb)" :block_height="getBlockHeight(sb)" />-->
                </li>
                <tr class="reset day-cells center" v-for="h in hours" :key="h">
                    <td class="reset day-cell">
                        <div class="day-cell-time-slot center"><span>-</span></div>
                        <div class="day-cell-time-slot center"><span>-</span></div>
                    </td>
                </tr>
            </table>
        </tbody>
    </table>
</template>

<style scoped>
/* Layout */
.week-schedule {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
}
.hours-column {
    display: flex;
    flex-direction: column;
    margin-right: 0.5rem;
}
.empty-hour {
    visibility: hidden;
}
.hour-cell {
    height: 100%;
    font-size: 0.8rem;
}
.week-columns {
    display: flex;
    width: 100%;
}
.day-column {
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
}
.day-cells {
    height: 100%;
}
.day-cell {
    width: 100%;
}
.day-cell-time-slot span {
    visibility: hidden;
}
.shift-block {
    position: absolute;
    width: 100%;
    padding: 0.2rem;
    box-sizing: border-box;
}
.header-cell {
    height: 2rem;
    padding: 0.5rem;
}
/* Appearance */
.day-column:nth-child(odd) {
    background-color: #ffffff;
}
.day-column:nth-child(even) {
    background-color: #f7f7f7;
}
.day-header,
.day-cells {
    box-shadow: inset -1px -1px 0px #8080803c;
}
.day-cell-time-slot:nth-child(odd) {
    box-shadow: inset 0px -1px 1px #8080801b;
}
.week-columns {
    box-shadow: 0px 0px 4px #0000003c;
}
.shift-block span {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #8a89d6;
    border-radius: 2px;
    padding: 2px;
    box-sizing: border-box;
    min-width: 0;
    cursor: pointer;
}
.shift-block span:nth-child(n + 1) {
    margin-left: 2px;
}
</style>

<script setup lang="ts">
import { Shift, ShiftInfo } from "../models/Shift.ts";
import ShiftItem from "./ShiftItem.vue";

type Day = "Segunda" | "Terça" | "Quarta" | "Quinta" | "Sexta";

const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const hours_string = hours.map((e) => e.toString().padStart(2, "0"));
const days: Day[] = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

const props = defineProps<{
    shifts: ShiftInfo[][];
}>();

const getShiftInfo = (
    s: Shift
): {
    type: "full" | "full-pressed" | "border" | "disabled" | "disabled-highlighted";
    color_nr: number;
    uc: string;
    name: string;
    room: string;
    capacity: string;
    show_capacity: boolean;
    start: number;
    end: number;
} => {
    return {
        type: "full",
        color_nr: 1,
        uc: s.course.toString(),
        name: s.type + s.number,
        room: s.room.toString(),
        capacity: "0/0",
        show_capacity: true,
        start: s.start,
        end: s.end
    };
};
</script>
