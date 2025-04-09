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
        <RequestsList :type=type :requests=requests id="requests" />
    </main>
</template>

<style scoped>
main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

#requests {
    width: 80vw;
    margin-top: 5vh;
}
</style>

<script setup lang="ts">
import Navbar from "../components/Navbar.vue";
import RequestsList from "../components/RequestsList.vue";

let type: "request" = "request";

// Example data, change later
let requests = [
    {
        id: 8,
        sender: "Nome",
        content: "Troca de turno PL4 -> PL6",
        date: new Date(),
    },
    {
        id: 9,
        sender: "Nome",
        content: "Troca de turno PL4 -> PL6",
        date: new Date(),
    },
    {
        id: 10,
        sender: "Nome",
        content: "Troca de turno PL4 -> PL6",
        date: new Date("2025-04-03"),
    },
    {
        id: 11,
        sender: "Nome",
        content: "Troca de turno PL4 -> PL6",
        date: new Date("2025-04-03"),
    }
]

</script>
