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
    <div ref="notification" class="notification" :class=props.type @click="props.type!='request' ? changeRead() : null">
        <div class="notification-left">
            <div v-if="props.type!='request'" class="bubble-position">
                <div ref="bubble" class="bubble" />
            </div>
            <div v-if="props.type!='request'" id="mail-card" />
            <p>{{ props.info.sender }}</p>
        </div>
        <div>
            <p>{{ props.info.content }}</p>
        </div>
        <div class="notification-right">
            <p>{{ getDate() }}</p>
            <div v-if="props.type=='director'" class="buttons">
                <IconButton type="accept" />
                <IconButton type="reject" />
                <IconButton type="view" :link=props.link />
            </div>
        </div>
    </div>
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
    box-shadow: 0px 2px 4px #0000003f;
    color: #333333;
    gap: 0 0.5rem;
    transition: background-color 0.1s linear, box-shadow 0.1s linear;
}

.notification > div > p:first-child {
    font-size: 0.96rem;
}

.notification:hover {
    cursor: pointer;
}

.director:hover {
    background-color: #eddfed;
    box-shadow: inset 2px 0 0 #80171B, 0px 2px 4px #0000003f;
}

.director .notification-right .buttons {
    display: none;
}

.director:hover .notification-right .buttons {
    display: flex;
    gap: 0.5rem;
}

.director:hover .notification-right p {
    display: none;
}

.unread .bubble-position {
    position: relative;
    width: 0;
    height: 0;
}

.unread .bubble {
    position: absolute;
    background-color: #20B6B0;
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 1rem;
    left: 0.3rem;
    bottom: 0.4rem;
    z-index: 1;
}

.unread {
    background-color: #f7f7f7;
}

.read {
    background-color: #ededed;
}

.closed {
    background-color: #00000000;
    filter: opacity(40%);
    box-shadow: 0 0 0 #00000000;
}

.notification > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
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
    background-color: #000;
    mask-image: url("/public/mail.svg");
    mask-size: cover;
}
</style>

<script setup lang="ts">
import IconButton from './IconButton.vue';
import { onMounted, ref } from 'vue';

const props = defineProps<{
    type: "student" | "director" | "request",
    info: {
        id: number,
        sender: string,
        content: string,
        date: Date,
        read?: boolean,
    },
    link?: string;
}>();

const emit = defineEmits<{
    (event: 'changeRead', read: boolean, id: number): void;
}>();

const getDate = () => {
    let today = new Date()
    return sameDay(props.info.date, today) ? "Hoje" : props.info.date.toLocaleDateString()
}

const sameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate()
}

const bubble = ref<HTMLElement>();
const notification = ref<HTMLElement>();

const changeRead = () => {
    props.info.read = true;
    display();
    emit('changeRead', true, props.info.id);
}

const display = () => {
    if (props.info.read && bubble.value && notification.value) {
        bubble.value.style.visibility = 'hidden';
        notification.value.classList.remove('unread');
        notification.value.classList.add('read');
    }
    else if (props.info.read === false && bubble.value && notification.value) {
        bubble.value.style.visibility = 'visible';
        notification.value.classList.remove('read');
        notification.value.classList.add('unread');
    }
}

onMounted(display)
</script>
