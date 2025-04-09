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
    <div class="shift-block">
        <Shift v-for="shift in props.shifts_info" :shift_info="shift"></Shift>
    </div>
</template>

<style scoped>

.shift-block {
    display: flex;
    width: 200px;
    height: 142px;
    padding: 5px;
    align-items: center;
    gap: 3px;
    flex-shrink: 0;
}

</style>

<script setup lang="ts">
import Shift from "./Shift.vue";
const props = defineProps<{
    shifts_info:{
        type: "full" | "full-pressed" | "border" | "disabled" | "disabled-highlighted";
        color_nr: number;
        uc: string;
        name: string;
        room: string;
        capacity: string;
        show_capacity: Boolean;
    }[]
}>();
</script>