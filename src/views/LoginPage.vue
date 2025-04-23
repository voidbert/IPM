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
    <Navbar type="login" />
    <main>Hello, world!</main>
    <TextInput type="text-input" placeholder="Email" />
    <TextInput type="search" placeholder="Password" />
    <Button type="action">
        <p><b>Iniciar Sessão</b></p>
    </Button>
    <p>
        <ShiftSelector :disciplinas="disciplinas" />
    </p>
</template>

<style scoped>
main {
    display: flex;
    flex-grow: 1;
    justify-content: center;
    align-items: center;

    padding: 10px;
}

.login-form {
    width: 25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.page-title {
    display: flex;
    justify-content: center;
    margin-top: 0px; /* For correct vertical centering */

    font-size: 1.5rem;
}

.login-submit-container {
    display: flex;
    flex-direction: row;
    gap: 1rem;

    margin-top: 1rem;
}

.warning-container {
    display: flex;
    flex: 2;
}

Button {
    flex: 1;
}
</style>

<script setup lang="ts">
import Button from "../components/Button.vue";
import ShiftSelector from "../components/ShiftSelector.vue";

type TurnoInfo = [string, boolean];
type Disciplinas = Record<string, TurnoInfo[]>;

const disciplinas: Disciplinas = {
    IPM: [['T1', true], ['PL1', false], ['PL2', true]],
    CP: [['T1', false], ['PL1', true], ['PL2', true]]
};
</script>
