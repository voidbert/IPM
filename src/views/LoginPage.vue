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
    <main>
        <form class="login-form">
            <h1 class="page-title">Iniciar Sessão</h1>
            <TextInput
                type="text"
                v-model="email"
                placeholder="Email"
                v-on:update:modelValue="resetWarning" />
            <TextInput
                type="password"
                v-model="password"
                placeholder="Password"
                v-on:update:modelValue="resetWarning" />
            <Checkbox v-model="rememberUser">Lembrar-se de mim</Checkbox>

            <div class="login-submit-container">
                <div class="warning-container">
                    <Warning v-if="wrongCredentials">Email / password incorreto</Warning>
                </div>
                <Button
                    @click="login"
                    :type="email && password ? 'action' : 'disabled'"
                    reasonDisabled="Preencha primeiro o email e a password">
                    Iniciar Sessão
                </Button>
            </div>
        </form>
    </main>
</template>

<style scoped>
main {
    display: flex;
    flex-grow: 1;
    justify-content: center;
    align-items: center;

    padding: 10px;
}

.login-form {
    width: 25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.page-title {
    display: flex;
    justify-content: center;
    margin-top: 0px; /* For correct vertical centering */

    font-size: 1.5rem;
}

.login-submit-container {
    display: flex;
    flex-direction: row;
    gap: 1rem;

    margin-top: 1rem;
}

.warning-container {
    display: flex;
    flex: 2;
}

Button {
    flex: 1;
}
</style>

<script setup lang="ts">
import Button from "../components/Button.vue";
import Checkbox from "../components/Checkbox.vue";
import TextInput from "../components/TextInput.vue";
import Warning from "../components/Warning.vue";

import { useLoginStore } from "../stores/login.ts";
import { User } from "../models/User.ts";

import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const rememberUser = ref(false);
const wrongCredentials = ref(false);

const resetWarning = () => {
    wrongCredentials.value = false;
};

const loginStore = useLoginStore();
const login = async (e: FormDataEvent) => {
    e.preventDefault();

    const user = await User.tryAuthenticate(email.value.toLowerCase(), password.value);
    if (user) {
        loginStore.login(email.value, password.value, rememberUser.value);

        switch (user.type) {
            case "student":
                router.replace("/MySchedule");
                break;

            case "director":
                router.replace("/SolveProblems");
                break;

            default:
                break;
        }
    } else {
        wrongCredentials.value = true;
        password.value = "";
    }
};
</script>
