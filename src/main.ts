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

import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";
import "./main.css";

import Login from "./views/Login.vue";
import MySchedule from "./views/MySchedule.vue";
import CompleteSchedule from "./views/CompleteSchedule.vue";
import SolveProblems from "./views/SolveProblems.vue";
import ManageShifts from "./views/ManageShifts.vue";
import ManageShift from "./views/ManageShift.vue";
import PublishSchedules from "./views/PublishSchedules.vue";

import { useLoginStore } from "./stores/login.ts";
import { Business } from "./models/Business.ts";

// Set up routes
export {};
declare module "vue-router" {
    interface RouteMeta {
        userType: "login" | "student" | "director";
    }
}

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "Login",
            component: Login,
            meta: {
                userType: "login"
            }
        },
        {
            path: "/MySchedule",
            name: "MySchedule",
            component: MySchedule,
            meta: {
                userType: "student"
            }
        },
        {
            path: "/CompleteSchedule",
            name: "CompleteSchedule",
            component: CompleteSchedule,
            meta: {
                userType: "student"
            }
        },
        {
            path: "/SolveProblems",
            name: "SolveProblems",
            component: SolveProblems,
            meta: {
                userType: "director"
            },
            children: [
                {
                    path: ":problem",
                    name: "SolveProblem",
                    component: SolveProblems
                }
            ],
            props: true
        },
        {
            path: "/ManageShifts",
            meta: {
                userType: "director"
            },
            children: [
                {
                    path: "",
                    name: "ManageShifts",
                    component: ManageShifts
                },
                {
                    path: ":shiftId",
                    name: "ManageShift",
                    component: ManageShift,
                    props: true
                }
            ]
        },
        {
            path: "/PublishSchedules",
            name: "PublishSchedules",
            component: PublishSchedules,
            meta: {
                userType: "director"
            }
        }
    ]
});

// Prepare application
const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

app.use(router);
app.use(pinia);

// Authorization
const loginStore = useLoginStore();
router.beforeEach(async (to) => {
    const email = loginStore.email;
    const password = loginStore.password;

    if (email && password) {
        const user = await Business.authenticate(email, password);

        if (!user) {
            loginStore.logout();
            return "/";
        } else if (user.type === to.meta.userType) {
            return true;
        } else if (user.type === "student") {
            return "/MySchedule";
        } else if (user.type === "director") {
            return "/SolveProblems";
        }
    } else if (to.name !== "Login") {
        return "/";
    }

    return true;
});

// Run application
app.mount("#app");
