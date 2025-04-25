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

import LoginPage from "./views/LoginPage.vue";
import MySchedule from "./views/MySchedule.vue";
import SolveProblems from "./views/SolveProblems.vue";
import Notifications from "./views/Notifications.vue";
import RequestsHistory from "./views/RequestsHistory.vue";

import { useLoginStore } from "./stores/login.ts";
import { User } from "./models/User.ts";

// Set up routes
export {};
declare module "vue-router" {
    interface RouteMeta {
        userType: Array<"login" | "student" | "director" | "professor">;
    }
}

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "LoginPage",
            component: LoginPage,
            meta: {
                userType: ["login"]
            }
        },
        {
            path: "/MySchedule",
            name: "MySchedule",
            component: MySchedule,
            meta: {
                userType: ["student"]
            }
        },
        {
            path: "/RequestsHistory",
            name: "RequestsHistory",
            component: RequestsHistory,
            meta: {
                userType: ["student"]
            }
        },
        {
            path: "/Notifications",
            name: "Notifications",
            component: Notifications,
            meta: {
                userType: ["student", "director"]
            }
        },
        {
            path: "/SolveProblems",
            name: "SolveProblems",
            component: SolveProblems,
            meta: {
                userType: ["director"]
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
        const user = await User.tryAuthenticate(email, password);

        if (!user) {
            loginStore.logout();
            return "/";
        } else if (to.meta.userType.includes(user.type)) {
            return true;
        } else if (user.type === "student") {
            return "/MySchedule";
        } else if (user.type === "director") {
            return "/SolveProblems";
        }
    } else if (to.name !== "LoginPage") {
        return "/";
    }

    return true;
});

// Run application
app.mount("#app");
