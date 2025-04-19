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
    <div class="week-schedule">
         <div class="hours-column">
             <div class="empty-hour header-cell"><span>h</span></div>
             <div class="hour-cell" v-for="h in hours_string"><span>{{ h }}h00</span></div>
         </div>
         <div class="week-columns">
             <div class="day-column" v-for="d in days">
                 <div class="day-header header-cell"><span>{{ d }}</span></div>
                     <div class="shift-block" v-for="(sb, index) in week_schedule[d]"
                          :key="index"
                          :style="{top: `calc(2rem + ${(sb.from - 8) * 7.92}%)`,
                                   height: `calc(((100% - (2rem)) / 12) * ${sb.to - sb.from})`}"
                          >
                         <span v-for="s in sb.shifts">{{ s.name }}</span>
                     </div>
                     <div class="day-cells" v-for="h in hours">
                         <div class="day-cell">
                             <div class="day-cell-time-slot"><span>-</span></div>
                             <div class="day-cell-time-slot"><span>-</span></div>
                         </div>
                     </div>
             </div>
         </div>
     </div>
</template>

<style scoped>
.week-schedule {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
}
    .hours-column {
        display: flex;
        flex-direction: column;
        height: 100%;
        margin-right: 0.5rem;
    }
        .empty-hour {
            visibility: hidden;
        }
        .hour-cell {
            display: flex;
            justify-content: end;
            align-items: start;
            height: 100%;
            font-size: 0.8rem;
        }
    .week-columns {
        display: flex;
        flex-direction: row;
        width: 100%;
    }
        .day-column {
            display: flex;
            flex-direction: column;
            width: 100%;
            position: relative;
        }
            .day-header {
            }
            .day-cells {
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
                .day-cell {
                    width: 100%;
                }
                    .day-cell-time-slot {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                        .day-cell-time-slot span {
                            visibility: hidden;
                        }
            .shift-block {
                position: absolute;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                padding: 0.5rem;
                box-sizing: border-box;
            }
.header-cell {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2rem;
    padding: 0.5rem;
}
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
.day-column {
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
}
.shift-block span:nth-child(n + 1) {
    margin-left: 2px;
}
</style>

<script setup lang="ts">
import { WeekSchedule, Day } from "../models/Shift.ts";

const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const hours_string = hours.map(e => e.toString().padStart(2, "0"));
const days : Day[] = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

const props = defineProps<{
    week_schedule: WeekSchedule;
}>();

const getShifts = (day: Day) => {
    return props.week_schedule[day].map(e =>
    {
        return e.shifts.map(s =>
        {
            s.start += e.from - 8;
            s.end += e.to - 8;
            return s
        })
    }).flat()
}
</script>
