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
    <Navbar type="student" />
    <main>
        <h3>Clique num turno para mais informação</h3>
        <WeeklySchedule :week_schedule="week_schedule" id="schedule" />
    </main>
</template>

<style scoped>
main {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
}
#schedule {
    width: 80vw;
}
</style>

<script setup lang="ts">
import Navbar from "../components/Navbar.vue";
import WeeklySchedule from "../components/WeeklySchedule.vue";
import { WeekSchedule } from "../models/Shift.ts";
import { ref } from "vue";

const week_schedule = ref<WeekSchedule>({
    Segunda: [
        {
            "from": 8,
            "to": 10,
            "divisions": 3,
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
                    "start": 1,
                    "end": 3,
                    "name": "Shift 3"
                }
            ]
        },
        {
            "from": 10,
            "to": 12,
            "divisions": 2,
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
            "divisions": 2,
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
            "divisions": 3,
            "shifts": [
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 7"
                },
                {
                    "start": 1,
                    "end": 3,
                    "name": "Shift 8"
                },
                {
                    "start": 1,
                    "end": 3,
                    "name": "Shift 9"
                }
            ]
        },
        {
            "from": 11,
            "to": 13,
            "divisions": 2,
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
            "divisions": 2,
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
            "divisions": 4,
            "shifts": [
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 13"
                },
                {
                    "start": 1,
                    "end": 3,
                    "name": "Shift 14"
                },
                {
                    "start": 2,
                    "end": 4,
                    "name": "Shift 15"
                }
            ]
        },
        {
            "from": 14,
            "to": 16,
            "divisions": 2,
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
            "divisions": 2,
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
            "divisions": 2,
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
            "divisions": 3,
            "shifts": [
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 22"
                },
                {
                    "start": 1,
                    "end": 3,
                    "name": "Shift 23"
                }
            ]
        },
        {
            "from": 14,
            "to": 16,
            "divisions": 2,
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
            "divisions": 2,
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
            "divisions": 2,
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
            "divisions": 2,
            "shifts": [
                {
                    "start": 0,
                    "end": 2,
                    "name": "Shift 30"
                }
            ]
        }
    ],
});

</script>
