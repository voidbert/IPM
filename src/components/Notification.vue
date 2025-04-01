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
    <div class="notification">
        <p>{{ from }}</p>
        <p>{{ description }}</p>
        <p>{{ getDate() }}</p>
    </div>
</template>

<style scoped>
.notification {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 50%;
    height: 100%;
    padding: 0.4rem 1.6rem;
    font-weight: 500;
    font-size: 0.8rem;
    box-shadow: 0px 2px 4px #0000003f;
    background-color: #f7f7f7;
    color: #333333;
}
p:first-child {
    font-size: 0.96rem;
}
:hover {
    cursor: pointer;
}
.unread {
    background-color: #ededed;
}
.read {
    background-color: #f7f7f7;
}
</style>

<script setup lang="ts">

const props = defineProps<{
    type: "student" | "director",
    from: String,
    description: String,
    date: Date
}>();

function getDate(): String {
    let today = new Date()
    return sameDay(props.date, today) ? "Hoje" : props.date.toLocaleDateString()
}

function sameDay(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate()
}

</script>
