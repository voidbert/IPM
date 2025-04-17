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
    <details open>
        <summary>
            <Checkbox :model-value="true" class="checkbox">IPM</Checkbox>
        </summary>
        <ul>
            <li>
                <details>
                    <summary>
                        <Checkbox :model-value="true" class="checkbox">IPM</Checkbox>
                    </summary>
                    <ul>
                        <li>
                            <Checkbox :model-value="true">T1</Checkbox>
                        </li>
                        <li>
                            <Checkbox :model-value="true">PL1</Checkbox>
                        </li>
                        <li>
                            <Checkbox :model-value="true">PL2</Checkbox>
                        </li>
                    </ul>
                </details>
            </li>
            <li>
            <details open>
                    <summary>
                        <Checkbox :model-value="true" class="checkbox">IPM</Checkbox>
                    </summary>
                    <ul>
                        <li>
                            <Checkbox :model-value="true">T1</Checkbox>
                        </li>
                        <li>
                            <Checkbox :model-value="true">PL1</Checkbox>
                        </li>
                        <li>
                            <Checkbox :model-value="true">PL2</Checkbox>
                        </li>
                    </ul>
                </details>
            </li>
        </ul>
    </details>
    <details open>
        <summary>
            <Checkbox :model-value="true" class="checkbox">CP</Checkbox>
        </summary>
        <ul>
            <li>
                <Checkbox :model-value="true">T1</Checkbox>
            </li>
            <li>
                <Checkbox :model-value="true">PL1</Checkbox>
            </li>
            <li>
                <Checkbox :model-value="true">PL2</Checkbox>
            </li>
        </ul>
    </details>
</template>

<script setup lang="ts">
import Checkbox from './Checkbox.vue';
</script>

<style scoped>

details {
    margin-left: 1em;
}

details ul {
    list-style-type: none;
    padding-left: 2.5em;
    margin-top: 0; 
}

details summary {
    display: flex;
    align-items: center;
    cursor: pointer;
}

details:not(open) summary::before {
    content: '▶';
    transform: rotate(0deg);
    color: var(--color-checkbox-checked-light);
}

details:open > summary::before {
    content: '▶';
    transform: rotate(90deg);
    color: var(--color-checkbox-checked-light);
}

details summary:hover:has(.checkbox:not(:hover))::before {
    filter: brightness(1.5) saturate(2);
}


</style>
