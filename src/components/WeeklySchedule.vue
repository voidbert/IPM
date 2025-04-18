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
                    <div class="shift" v-for="(sb, index) in shifts_days[d]"
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
            .shift {
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
.shift span {
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
.shift span:nth-child(n + 1) {
    margin-left: 2px;
}
</style>

<script setup lang="ts">
const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const hours_string = hours.map(e => e.toString().padStart(2, "0"));
const days : Day[] = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
const shifts = [1, 2, 3, 4];
type Day = "Segunda" | "Terça" | "Quarta" | "Quinta" | "Sexta";
interface Shift {
    start: number;
    end: number;
    name: string;
}
interface ShiftBlock {
    from: number;
    to: number;
    shifts: Shift[];
}
type ShiftsDays = Record<Day, ShiftBlock[]>;
const shifts_days: ShiftsDays = {
    Segunda: [
        {
            "from": 8,
            "to": 10,
            "shifts": [
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 1"
                },
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 2"
                },
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 3"
                }
            ]
        },
        {
            "from": 10,
            "to": 12,
            "shifts": [
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 4"
                },
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 5"
                }
            ]
        },
        {
            "from": 13,
            "to": 15,
            "shifts": [
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 6"
                }
            ]
        }
    ],
    Terça: [
    {
            "from": 9,
            "to": 11,
            "shifts": [
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 7"
                },
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 8"
                },
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 9"
                }
            ]
        },
        {
            "from": 11,
            "to": 13,
            "shifts": [
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 10"
                },
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 11"
                }
            ]
        },
        {
            "from": 14,
            "to": 16,
            "shifts": [
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 12"
                }
            ]
        }
    ],
    Quarta: [
    {
            "from": 11,
            "to": 13,
            "shifts": [
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 13"
                },
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 14"
                },
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 15"
                }
            ]
        },
        {
            "from": 14,
            "to": 16,
            "shifts": [
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 16"
                },
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 17"
                }
            ]
        },
        {
            "from": 16,
            "to": 18,
            "shifts": [
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 18"
                }
            ]
        }
    ],
    Quinta: [
    {
            "from": 8,
            "to": 10,
            "shifts": [
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 19"
                },
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 20"
                },
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 21"
                }
            ]
        },
        {
            "from": 10,
            "to": 12,
            "shifts": [
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 22"
                },
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 23"
                }
            ]
        },
        {
            "from": 14,
            "to": 16,
            "shifts": [
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 24"
                }
            ]
        }
    ],
    Sexta: [
    {
            "from": 8,
            "to": 10,
            "shifts": [
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 25"
                },
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 26"
                },
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 27"
                }
            ]
        },
        {
            "from": 10,
            "to": 12,
            "shifts": [
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 28"
                },
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 29"
                }
            ]
        },
        {
            "from": 13,
            "to": 15,
            "shifts": [
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 30"
                }
            ]
        }
    ],
}

const getShifts = (day: Day) => {
    return shifts_days[day].map(e => e.shifts.map(s => {s.start += e.from - 8; s.end += e.to - 8; return s})).flat()
}
</script>
