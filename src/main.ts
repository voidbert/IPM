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

import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";
import "./main.css";

import LoginPage from "./views/LoginPage.vue";
import MySchedule from "./views/MySchedule.vue";
import SolveProblems from "./views/SolveProblems.vue";

// Set up routes
export {};
declare module "vue-router" {
    interface RouteMeta {
        navbarType: "login" | "student" | "director";
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
                navbarType: "login"
            }
        },
        {
            path: "/MySchedule",
            name: "MySchedule",
            component: MySchedule,
            meta: {
                navbarType: "student"
            }
        },
        {
            path: "/SolveProblems",
            name: "SolveProblems",
            component: SolveProblems,
            meta: {
                navbarType: "director"
            }
        }
    ]
});

// Run application
const app = createApp(App);
app.use(router);
app.mount("#app");
