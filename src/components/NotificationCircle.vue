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
    <span class="notification-circle" />
</template>

<style scoped>
.notification-circle {
    position: absolute;
    width: 0.8rem;
    height: 0.8rem;
    top: calc(0% - 0.4rem);
    right: calc(0% - 0.4rem);

    border-radius: 50%;
    background-color: var(--color-notification-circle);
}
</style>
