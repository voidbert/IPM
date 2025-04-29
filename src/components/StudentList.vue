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
    <TextInput
        type="search"
        placeholder="Pesquisar"
        v-model="search"
        v-on:update:modelValue="updateWidth" />

    <div ref="studentList" class="student-list-students">
        <PresentedStudent
            v-for="(student, i) in shownStudents"
            :key="i"
            :type="props.type"
            :student="student"
            @act="$emit('act', student)" />
    </div>
</template>

<style scoped>
.student-list-students {
    width: v-bind(fixedWidth);

    display: flex;
    flex-direction: column;
    flex: 1 0 0;

    overflow: hidden scroll;
}
</style>

<script setup lang="ts">
import PresentedStudent from "../components/PresentedStudent.vue";
import TextInput from "../components/TextInput.vue";

import { User } from "../models/User.ts";

import { computed, ref, useTemplateRef } from "vue";

const props = defineProps<{
    students: User[];
    type: "add" | "remove";
}>();

defineEmits<{
    (e: "act", student: User): void;
}>();

const search = ref("");
const shownStudents = computed(() => {
    return props.students.filter(
        (student) =>
            student.name.toLowerCase().includes(search.value.toLowerCase()) ||
            (student.number || "").toLowerCase().includes(search.value.toLowerCase())
    );
});

// Always keep the student list's width the same, despite the elements actually being shown
const studentList = useTemplateRef("studentList");
const fixedWidth = ref("auto");
const updateWidth = () => {
    if (fixedWidth.value === "auto") {
        fixedWidth.value = getComputedStyle(studentList.value as Element).width;
    }
};
</script>
