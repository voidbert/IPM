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
    <div
        class="shift"
        :class="props.shift_info.type"
        :style="style"
        @mouseenter="hover = true"
        @mouseleave="hover = false">
        <p>{{ props.shift_info.uc }}</p>
        <p>{{ props.shift_info.name }}</p>
        <p class="room-text">{{ props.shift_info.room }}</p>
        <p v-if="props.shift_info.show_capacity" class="capacity">
            {{ props.shift_info.capacity }}
        </p>
    </div>
</template>

<style scoped>
.shift {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1 0 0;
    align-self: stretch;
    flex-shrink: 0;
    border-radius: 5px;
}

.shift p {
    margin-top: 0.4rem;
    margin-bottom: 0.4rem;
    margin-left: 20%;
    margin-right: 20%;
    color: var(--color-shift-text);
}

.room-text {
    font-size: 0.75em;
}

.full {
    border: 1px solid var(--color-shift-border);
}

.full-pressed {
    border: 1px solid var(--color-shift-border);
    box-shadow: 0px 4px 6px 0px var(--color-shift-dark-grey) inset;
}

.border {
    background: var(--color-shift-grey);
}

.disabled {
    border: 1px solid var(--color-shift-border);
    background: var(--color-shift-grey);
}

.disabled-highlighted {
    border: 1px solid var(--color-shift-border);
    background: var(--color-shift-dark-grey);
}

.capacity {
    position: relative;
    left: 35%;
    top: 8%;
}
</style>

<script setup lang="ts">
import { computed, ref } from "vue";
const props = defineProps<{
    shift_info: {
        type: "full" | "full-pressed" | "border" | "disabled" | "disabled-highlighted";
        color_nr: number;
        uc: string;
        name: string;
        room: string;
        capacity: string;
        show_capacity: boolean;
    };
}>();
const hover = ref(false);
const style = computed(() => {
    if (props.shift_info.type == "full" && !hover.value) {
        return `background: var(--color-shift-${props.shift_info.color_nr}); box-shadow: 0px -2px 0px 0px var(--color-shift-${props.shift_info.color_nr}-bright) inset;`;
    } else if (props.shift_info.type == "full") {
        return `background: var(--color-shift-${props.shift_info.color_nr}-bright); box-shadow: 0px -2px 0px 0px var(--color-shift-${props.shift_info.color_nr}-bright) inset;`;
    } else if (props.shift_info.type == "full-pressed") {
        return `background: var(--color-shift-${props.shift_info.color_nr});`;
    } else if (props.shift_info.type == "border" && !hover.value) {
        return `border: 5px solid var(--color-shift-${props.shift_info.color_nr}); box-shadow: 0px -2px 0px 0px var(--color-shift-${props.shift_info.color_nr}-bright) inset;`;
    } else if (props.shift_info.type == "border") {
        return `border: 5px solid var(--color-shift-${props.shift_info.color_nr}-bright); box-shadow: 0px -2px 0px 0px var(--color-shift-${props.shift_info.color_nr}-bright) inset;`;
    } else {
        return "";
    }
});
</script>
