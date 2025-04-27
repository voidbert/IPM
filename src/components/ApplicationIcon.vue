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
    <div class="application-icon">
        <img src="/favicon.svg" class="application-icon-svg" alt="SWAP's icon" />
        <span class="application-icon-text">SWAP</span>
    </div>
</template>

<style scoped>
.application-icon {
    display: flex;
    justify-content: left;
    align-items: center;
}

.application-icon-svg {
    height: 4rem;
}

.application-icon-text {
    color: var(--color-navbar-foreground);
    font-size: 1.5em;
    font-weight: bold;

    cursor: default;
    user-select: none;
    -webkit-user-select: none;
}
</style>
