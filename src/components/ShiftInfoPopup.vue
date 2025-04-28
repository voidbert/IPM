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
    <Popup v-model="model">
        <div class="shift-info-popup-content">
            <h1>{{ props.course.name }}</h1>
            <h2>
                Turno {{ props.shift.name }} – {{ props.shift.prettyDay }},
                {{ props.shift.prettyStart }} – {{ props.shift.prettyEnd }}
            </h2>
            <h3>{{ props.room.name }}</h3>
            <h3>Docente: {{ professor.name }}</h3>

            <div class="shift-info-popup-bottom">
                <Capacity
                    :attendence="props.attendence"
                    :capacity="Business.getShiftCapacity(props.shift, props.course, props.room)" />

                <Button
                    :type="props.changePossible ? 'action' : 'disabled'"
                    reasonDisabled="Não há trocas possíveis para este turno"
                    @click="accept()"
                    >Procurar Troca</Button
                >
            </div>
        </div>
    </Popup>
</template>

<style scoped>
.shift-info-popup-content {
    display: flex;
    flex-direction: column;
    align-items: center;

    gap: 1em;
    padding: 0.5em 1em;
}

.shift-info-popup-content > * {
    margin: 0px;
}

.shift-info-popup-content > h3 {
    font-weight: normal;
}

.shift-info-popup-bottom {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-top: 2em;
}
</style>

<script setup lang="ts">
import Button from "./Button.vue";
import Capacity from "./Capacity.vue";
import Popup from "./Popup.vue";

import { Business } from "../models/Business.ts";
import { Course } from "../models/Course.ts";
import { Room } from "../models/Room.ts";
import { Shift } from "../models/Shift.ts";
import { User } from "../models/User.ts";

export interface ShiftInfo {
    shift: Shift;
    course: Course;
    room: Room;
    professor: User;
    attendence: number;
    changePossible: boolean;
}

const props = defineProps<ShiftInfo>();

const emit = defineEmits<{
    (e: "accept"): void;
}>();

const model = defineModel<boolean>();

const accept = () => {
    model.value = false;
    emit("accept");
};
</script>
