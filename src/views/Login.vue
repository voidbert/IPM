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
    <main id="login-main">
        <form id="login-form">
            <h1 id="login-title">Iniciar Sessão</h1>
            <TextInput
                type="text"
                v-model="email"
                placeholder="Email"
                v-on:update:modelValue="wrongCredentials = false" />
            <TextInput
                type="password"
                v-model="password"
                placeholder="Password"
                v-on:update:modelValue="wrongCredentials = false" />
            <Checkbox v-model="rememberUser">Lembrar-se de mim</Checkbox>

            <div id="login-submit-container">
                <Warning
                    :class="!wrongCredentials ? 'login-warning-invisible' : ''"
                    id="login-warning"
                    >Email / password incorreto</Warning
                >
                <Button
                    @click.prevent="login"
                    :type="email && password ? 'action' : 'disabled'"
                    reasonDisabled="Preencha primeiro o email e a password">
                    Iniciar Sessão
                </Button>
            </div>
        </form>
    </main>
</template>

<style scoped>
#login-main {
    display: flex;
    flex: 1 0 0;
    justify-content: center;
    align-items: center;

    padding: 0.5em;
}

#login-form {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
}

@media (orientation: portrait) {
    #login-form {
        font-size: 1.3em;
        gap: 1em;
    }

    #login-warning {
        font-size: 1em;
    }
}

#login-title {
    display: flex;
    justify-content: center;
    margin-top: 0px;

    font-size: 1.5em;
}

#login-submit-container {
    display: flex;
    justify-content: space-between;
    gap: 1em;

    margin-top: 1em;
}

.login-warning-invisible {
    opacity: 0%;
    pointer-events: none;
}
</style>

<script setup lang="ts">
import Button from "../components/Button.vue";
import Checkbox from "../components/Checkbox.vue";
import TextInput from "../components/TextInput.vue";
import Warning from "../components/Warning.vue";

import { useLoginStore } from "../stores/login.ts";
import { Business } from "../models/Business.ts";

import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const email = ref("");
const password = ref("");
const rememberUser = ref(false);
const wrongCredentials = ref(false);

const loginStore = useLoginStore();
const login = async () => {
    const user = await Business.authenticate(email.value.toLowerCase(), password.value);
    if (user) {
        loginStore.login(email.value, password.value, rememberUser.value);

        switch (user.type) {
            case "student":
                router.push("/MySchedule");
                break;
            case "director":
                router.push("/SolveProblems");
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
