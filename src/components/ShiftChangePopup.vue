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
        <div class="shift-change-popup-container">
            Deseja pedir para se mudar para este turno?

            <div class="shift-change-popup-shifts">
                <div class="shift-change-popup-shift-container">
                    O seu turno atual
                    <div class="shift-change-popup-shift">
                        <span>{{ props.course.shortName }} – {{ props.original.name }}</span>
                        <span>
                            {{ props.original.prettyDay }}, {{ props.original.prettyStart }} –
                            {{ props.original.prettyEnd }}
                        </span>
                    </div>
                </div>

                <div class="shift-change-popup-shift-container">
                    O seu novo turno
                    <div class="shift-change-popup-shift">
                        <span>{{ props.course.shortName }} – {{ props.replacement.name }}</span>
                        <span>
                            {{ props.replacement.prettyDay }}, {{ props.replacement.prettyStart }} –
                            {{ props.replacement.prettyEnd }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="shift-change-popup-bottom">
                <Button type="cancel" @click="model = false">Cancelar</Button>
                <Button @click="accept()">Confirmar</Button>
            </div>
        </div>
    </Popup>
</template>

<style scoped>
.shift-change-popup-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    gap: 2em;
    padding: 0.5em 1em;
}

.shift-change-popup-shifts {
    display: flex;
    gap: 5em;
}

.shift-change-popup-shift-container {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
}

.shift-change-popup-shift {
    display: flex;
    flex-direction: column;
    gap: 0.5em;

    padding: 0.5em;
    border: 1px solid var(--color-body-foreground);
    border-radius: 0.5em;

    box-shadow: 2px 2px 1px #444;
}

.shift-change-popup-bottom {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>

<script setup lang="ts">
import Button from "./Button.vue";
import Popup from "./Popup.vue";

import { Course } from "../models/Course.ts";
import { Shift } from "../models/Shift.ts";

const props = defineProps<{
    original: Shift;
    replacement: Shift;
    course: Course;
}>();

const emit = defineEmits<{
    (e: "accept"): void;
}>();

const model = defineModel<boolean>();

const accept = () => {
    model.value = false;
    emit("accept");
};
</script>
