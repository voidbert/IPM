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

import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { User } from "../models/User.ts";

import { useShiftSelectorStore } from "./shiftSelector.ts";

const usePersistentLoginStore = defineStore(
    "loginPersistent",
    () => {
        const email = ref<null | string>(null);
        const password = ref<null | string>(null);
        return { email, password };
    },
    {
        persist: true
    }
);

export const useLoginStore = defineStore(
    "login",
    () => {
        const temporaryEmail = ref<null | string>(null);
        const temporaryPassword = ref<null | string>(null);
        const user = ref<User>(User.createFromObject({}));

        const persistent = usePersistentLoginStore();
        const email = computed(() => persistent.email || temporaryEmail.value);
        const password = computed(() => persistent.password || temporaryPassword.value);

        const login = (email: string, password: string, loginUser: User, rememberUser: boolean) => {
            temporaryEmail.value = email;
            temporaryPassword.value = password;
            user.value = loginUser;

            if (rememberUser) {
                persistent.email = email;
                persistent.password = password;
            }
        };

        const logout = () => {
            temporaryEmail.value = null;
            temporaryPassword.value = null;
            user.value = User.createFromObject({});
            persistent.email = null;
            persistent.password = null;

            const shiftSelectorStore = useShiftSelectorStore();
            shiftSelectorStore.reset();
        };

        return { temporaryEmail, temporaryPassword, email, password, user, login, logout };
    },
    {
        persist: {
            storage: sessionStorage
        }
    }
);
