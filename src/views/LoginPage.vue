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
        <ShiftSelector></ShiftSelector>
    </p>
</template>

<style scoped>
main {
    padding: 10px;
}
Button {
    /* Just for testing purposes, change later */
    position: absolute;
    width: 10vw;
    height: 5vh;
    left: 50vw;
    bottom: 30vh;
}
</style>

<script setup lang="ts">
import Navbar from "../components/Navbar.vue";
import TextInput from "../components/TextInput.vue";
import Button from "../components/Button.vue";
import ShiftSelector from "../components/ShiftSelector.vue";
</script>
