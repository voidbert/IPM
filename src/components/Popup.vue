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
    <div class="dialog-container" v-if="model">
        <dialog open>
            <div class="dialog-title-bar">
                <ApplicationIcon />
                <div class="dialog-title-bar-close-container">
                    <NavbarHoverableIcon url="/close.svg" tooltip="Fechar" @click="model = false" />
                </div>
            </div>
            <div class="dialog-contents">
                <slot />
            </div>
        </dialog>
    </div>
</template>

<style scoped>
.dialog-container {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;

    backdrop-filter: blur(5px) brightness(60%);
}

dialog {
    all: unset;
}

.dialog-title-bar {
    display: flex;
    height: 4rem;

    align-items: center;
    justify-content: space-between;
    gap: 10vw;

    border-radius: 5px 5px 0px 0px;
    padding: 0px 10px;

    background-color: var(--color-uminho);
}

.dialog-title-bar-close-container {
    height: 60%;
}

.dialog-contents {
    display: flex;
    padding: 10px;

    border-radius: 0px 0px 5px 5px;
    background-color: var(--color-body-background);
}
</style>

<script setup lang="ts">
import ApplicationIcon from "./ApplicationIcon.vue";
import NavbarHoverableIcon from "./NavbarHoverableIcon.vue";
const model = defineModel();
</script>
