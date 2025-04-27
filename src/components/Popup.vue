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
    <div class="popup-blur-container" v-if="model">
        <dialog open class="popup">
            <div class="popup-title-bar">
                <ApplicationIcon />
                <NavbarHoverableIcon
                    class="popup-close-icon"
                    url="/close.svg"
                    tooltip="Fechar"
                    @click="model = false" />
            </div>
            <div class="popup-contents">
                <slot />
            </div>
        </dialog>
    </div>
</template>

<style scoped>
.popup-blur-container {
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

.popup {
    all: unset;
    max-width: calc(100vw - 2rem);
}

.popup-title-bar {
    display: flex;
    height: 4rem;

    align-items: center;
    justify-content: space-between;

    border-radius: 5px 5px 0px 0px;
    padding: 0px 10px;

    background-color: var(--color-uminho);
}

.popup-close-icon {
    height: 3em;
}

.popup-contents {
    display: flex;
    padding: 0.5em;

    border-radius: 0px 0px 5px 5px;
    background-color: var(--color-body-background);
}
</style>

<script setup lang="ts">
import ApplicationIcon from "./ApplicationIcon.vue";
import NavbarHoverableIcon from "./NavbarHoverableIcon.vue";

const model = defineModel({ type: Boolean });
</script>
