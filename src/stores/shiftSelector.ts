// Copyright 2025 Ana Oliveira, Humberto Gomes, Inês Marques, Rafael Vilas Boas, Sara Lopes
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { ref } from "vue";
import { defineStore } from "pinia";

export const useShiftSelectorStore = defineStore(
    "shiftSelector",
    () => {
        const initialized = ref(false);
        const selectedShifts = ref<Record<string, boolean>>({});
        const openCourses = ref<Record<string, boolean>>({});

        const reset = () => {
            initialized.value = false;
            selectedShifts.value = {};
            openCourses.value = {};
        };

        return { initialized, selectedShifts, openCourses, reset };
    },
    {
        persist: true
    }
);
