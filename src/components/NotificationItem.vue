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
    <li
        ref="notification_elem"
        class="reset notification"
        :class="props.type"
        @click="props.type != 'request' ? changeRead() : null">
        <div class="notification-left">
            <div v-if="props.type != 'request'" class="bubble-position">
                <div ref="bubble_elem" class="bubble" />
            </div>
            <img v-if="props.type != 'request'" class="reset" id="mail-card" />
            <p>{{ props.info.sender }}</p>
        </div>
        <div>
            <p>{{ props.info.content }}</p>
        </div>
        <div class="notification-right">
            <p>{{ getDate() }}</p>
            <div v-if="props.type == 'director' && props.info.state == 'pending'" class="buttons">
                <IconButton type="accept" @click="acceptAction" />
                <IconButton type="reject" @click="rejectAction" />
                <IconButton type="view" :link="props.link" />
            </div>
            <img
                v-if="props.type == 'director' && props.info.state != 'pending'"
                id="state"
                class="reset"
                :class="props.info.state" />
        </div>
    </li>
</template>

<style scoped>
.notification {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0.4rem 1.6rem;
    font-weight: 500;
    font-size: 0.8rem;
    box-shadow: 0px 2px 4px var(--color-notification-shadow);
    color: var(--color-notification-text);
    gap: 0 0.5rem;
    transition:
        background-color 0.1s linear,
        box-shadow 0.1s linear;
}

.notification > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.notification > div > p:first-child {
    font-size: 0.96rem;
}

.notification:hover:not(.closed) {
    cursor: pointer;
}

.notification-left {
    gap: 0 0.5rem;
}

.notification-right {
    width: 5rem;
}

#mail-card {
    width: 2rem;
    height: 2rem;
    background-color: var(--color-notification-card);
    mask-image: url("/public/mail.svg");
    mask-size: cover;
}

.director:hover:not(.closed) {
    background-color: var(--color-notification-director-hover);
    box-shadow:
        inset 2px 0 0 var(--color-notification-director-side-hover),
        0px 2px 4px var(--color-notification-shadow);
}

.unread .bubble-position {
    position: relative;
    width: 0;
    height: 0;
}

.unread .bubble {
    position: absolute;
    background-color: var(--color-notification-bubble);
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 1rem;
    left: 0.3rem;
    bottom: 0.4rem;
    z-index: 1;
}

.unread {
    background-color: var(--color-notification-unread);
}

.read {
    background-color: var(--color-notification-read);
}

.closed {
    background-color: var(--color-notification-closed);
    filter: opacity(40%);
    box-shadow: 0 0 0 var(--color-notification-closed);
}

.director .notification-right .buttons {
    display: none;
}

.director:hover:not(.closed) .notification-right .buttons {
    display: flex;
    gap: 0.5rem;
}

.director:hover:not(.closed) .notification-right p {
    display: none;
}

#state {
    position: absolute;
    width: 1.5rem;
    height: 1.5rem;
    right: 25%;
    background-color: var(--color-notification-icon-state);
}

#state.accepted {
    mask-image: url("/public/icon-accept.svg");
    mask-size: cover;
}

#state.rejected {
    mask-image: url("/public/icon-reject.svg");
    mask-size: cover;
}
</style>

<script setup lang="ts">
import IconButton from "./IconButton.vue";
import { onMounted, ref } from "vue";
import { Notification, State, Notification_Type } from "../models/Notification.ts";

const bubble_elem = ref<HTMLElement>();
const notification_elem = ref<HTMLElement>();

const props = defineProps<{
    type: Notification_Type;
    info: Notification;
    link?: string;
}>();

const emit = defineEmits<{
    (event: "changeRead", read: boolean, id: number): void;
    (event: "changeState", state: State, id: number): void;
}>();

const getDate = () => {
    const today = new Date();
    return sameDay(props.info.date, today) ? "Hoje" : props.info.date.toLocaleDateString();
};

const sameDay = (d1: Date, d2: Date) => {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
};

const setClosed = () => {
    if (notification_elem.value) {
        notification_elem.value.classList.remove("unread");
        notification_elem.value.classList.remove("read");
        notification_elem.value.classList.add("closed");
    }
};

const acceptAction = () => {
    emit("changeState", "accepted", props.info.id);
    setClosed();
};

const rejectAction = () => {
    emit("changeState", "rejected", props.info.id);
    setClosed();
};

const changeRead = () => {
    emit("changeRead", true, props.info.id);
    display();
};

const display = () => {
    if (
        props.info.read &&
        bubble_elem.value &&
        notification_elem.value &&
        (props.info.state == "pending" || props.type == "student")
    ) {
        bubble_elem.value.style.visibility = "hidden";
        notification_elem.value.classList.remove("unread");
        notification_elem.value.classList.add("read");
    } else if (
        props.info.read === false &&
        bubble_elem.value &&
        notification_elem.value &&
        (props.info.state == "pending" || props.type == "student")
    ) {
        bubble_elem.value.style.visibility = "visible";
        notification_elem.value.classList.remove("read");
        notification_elem.value.classList.add("unread");
    } else if (props.info.state != "pending" && props.type != "request") {
        setClosed();
    }
};

onMounted(display);
</script>
