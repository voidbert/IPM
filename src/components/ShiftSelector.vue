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
    <div v-if="Object.keys(model).length">
        <div v-for="(turnos, disciplina) in model" :key="disciplina">
            <details open>
                <summary>
                    <Checkbox
                        v-model="disciplinasSelecionadas[disciplina]"
                        :indeterminate="isIndeterminate(disciplina)"
                        @change="onDisciplinaChange(disciplina)"
                        class="checkbox">
                        {{ disciplina }}
                    </Checkbox>
                </summary>
                <ul>
                    <li v-for="(turno, index) in turnos" :key="turno[0]">
                        <Checkbox
                            v-model="model[disciplina][index][1]"
                            @change="onTurnoChange(disciplina)">
                            {{ turno[0] }}
                        </Checkbox>
                    </li>
                </ul>
            </details>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import Checkbox from "./Checkbox.vue";

type TurnoInfo = [string, boolean];
type Disciplinas = Record<string, TurnoInfo[]>;

const props = defineProps<{
    disciplinas: Disciplinas;
}>();

const model = reactive<Disciplinas>(structuredClone(props.disciplinas));

const disciplinasSelecionadas = reactive<Record<string, boolean>>({});

for (const [disciplina, turnos] of Object.entries(model)) {
    disciplinasSelecionadas[disciplina] = turnos.every((t) => t[1]);
}

function isIndeterminate(disciplina: string) {
    const turnos = model[disciplina];
    const selecionados = turnos.filter((t) => t[1]).length;
    if (selecionados > 0 && selecionados < turnos.length) return null;
    else return false;
}

function onDisciplinaChange(disciplina: string) {
    const novoEstado = disciplinasSelecionadas[disciplina];
    model[disciplina].forEach((t) => (t[1] = novoEstado));
}

function onTurnoChange(disciplina: string) {
    const turnos = model[disciplina];
    disciplinasSelecionadas[disciplina] = turnos.every((t) => t[1]);
}
</script>

<style scoped>
details {
    margin-left: 1em;
}

details ul {
    list-style-type: none;
    padding-left: 2.5em;
    margin-top: 0;
}

details summary {
    display: flex;
    align-items: center;
}

details:not(open) summary::before {
    content: "▶";
    transform: rotate(0deg);
    color: black;
}

details:open > summary::before {
    content: "▶";
    transform: rotate(90deg);
    color: black;
}

details summary:hover:has(.checkbox:not(:hover))::before {
    color: rgb(140, 139, 139);
}
</style>
