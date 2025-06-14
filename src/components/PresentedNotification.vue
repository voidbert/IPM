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
        :class="[
            'notification',
            `notification-${props.type}`,
            `notification-${props.notification.state}`
        ]">
        <div class="notification-left">
            <span v-if="props.type != 'request'" class="notification-card" />
            <NotificationCircle
                v-if="props.type != 'request' && !props.notification.read"
                class="notification-card-circle" />
            <span>{{ shownName }}</span>
        </div>

        <span class="notification-content">{{ shownContent }}</span>

        <span
            v-if="
                type === 'request' || (type === 'director' && props.notification.state != 'pending')
            "
            :class="['notification-state', `notification-state-${props.notification.state}`]"
            :title="stateTooltip" />

        <div class="notification-right">
            <span class="notification-date">{{ shownDate }}</span>

            <div
                v-if="props.type == 'director' && props.notification.state == 'pending'"
                class="notification-buttons">
                <IconButton
                    type="reject"
                    @click="reject"
                    :disabled="props.notification.type == 'system'" />
                <IconButton
                    type="accept"
                    @click="accept"
                    :disabled="props.notification.type == 'system'" />
                <IconButton type="view" @click="goTo" />
            </div>
        </div>
    </li>
</template>

<style scoped>
.notification {
    position: relative;
    height: 2em;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 1em;
    border-radius: 0.5em;

    box-shadow: 0px 2px 4px var(--color-notification-shadow);
    color: var(--color-notification-foreground);
    transition: background-color 0.1s linear;

    cursor: default;
}

.notification-pending {
    background-color: var(--color-notification-background-unread);
}

.notification-accepted,
.notification-rejected {
    background-color: var(--color-notification-background-read);
}

.notification-left {
    width: 20em;
    display: flex;
    align-items: center;
    gap: 0.5em;
}

.notification-card {
    width: 2em;
    height: 2em;

    background-color: var(--color-notification-foreground);
    mask-image: url("/mail.svg");
    mask-size: cover;
}

.notification-card-circle {
    left: 0.6em;
    top: 0.8em;
}

.notification-state {
    width: 2em;
    height: 2em;

    background-color: var(--color-notification-foreground);
    mask-size: cover;
}

.notification-content {
    flex: 1 1 0;
}

.notification-state-accepted {
    mask-image: url("/accept.svg");
}

.notification-state-rejected {
    mask-image: url("/reject.svg");
}

.notification-state-pending {
    mask-image: url("/hour-glass.svg");
}

.notification-right {
    width: 10em;
    text-align: right;
}

.notification-director {
    --notification-buttons-display: none;
    --notification-date-color: var(--color-notification-foreground);
    --notification-date-pointer-events: all;
}

.notification-director:hover {
    /* Needed on Firefox to propagate downwards */
    --notification-buttons-display: flex;
    --notification-date-color: #00000000;
    --notification-date-pointer-events: none;
    background-color: var(--color-notification-hover);
    box-shadow:
        inset 0.2em 0 0 var(--color-uminho),
        0px 2px 4px #0000003f;
}

.notification-director.notification-pending .notification-date {
    color: var(--notification-date-color);
    pointer-events: var(--notification-date-pointer-events);
    transition: none;
}

.notification-buttons {
    position: absolute;
    right: 1em;
    top: 1em;

    display: var(--notification-buttons-display);
    gap: 0.2em;
}
</style>

<script setup lang="ts">
import IconButton from "./IconButton.vue";

import { Course } from "../models/Course.ts";
import { Notification } from "../models/Notification.ts";
import { Shift } from "../models/Shift.ts";
import { User } from "../models/User.ts";

import { computed } from "vue";
import { useRouter } from "vue-router";
import NotificationCircle from "./NotificationCircle.vue";

export interface PageNotification {
    notification: Notification;
    nameUser: User;
    course?: Course;
    fromShift?: Shift;
    toShift?: Shift;
    currentShift?: Shift;
    type: "student" | "director" | "request";
}

const props = defineProps<PageNotification>();

const shownName = computed(() => {
    if (props.notification.type == "system") return "Sistema";
    const names = props.nameUser.name.split(" ");
    return names[0] + " " + names[names.length - 1];
});

const shownContent = computed(() => {
    if (props.notification.type === "studentRequest") {
        return `Troca de turno: ${(props.course as Course).shortName} ${(props.fromShift as Shift).name} → ${(props.toShift as Shift).name}`;
    } else if (props.notification.type === "professorRequest") {
        return `Troca de sala: ${(props.course as Course).shortName} ${(props.currentShift as Shift).name}`;
    } else if (props.notification.type === "system") {
        return props.notification.systemMessage;
    } else {
        return "O seu horário sofreu alterações";
    }
});

const stateTooltip = computed(() => {
    return {
        pending: "Pendente",
        accepted: "Aceite",
        rejected: "Rejeitado"
    }[props.notification.state];
});

const shownDate = computed(() => {
    const diffSeconds = new Date().getTime() - props.notification.date.getTime();
    const diffDays = Math.round(diffSeconds / (24 * 60 * 60 * 1000));
    return (
        {
            0: "Hoje",
            1: "Ontem"
        }[diffDays] || props.notification.date.toLocaleDateString()
    );
});

const accept = () => {
    // eslint-disable-next-line vue/no-mutating-props
    props.notification.state = "accepted";
    // eslint-disable-next-line vue/no-mutating-props
    props.notification.read = true;
    props.notification.update();
};

const reject = () => {
    // eslint-disable-next-line vue/no-mutating-props
    props.notification.state = "rejected";
    // eslint-disable-next-line vue/no-mutating-props
    props.notification.read = true;
    props.notification.update();
};

const router = useRouter();
const goTo = () => {
    if (props.notification.type != "system") {
        // eslint-disable-next-line vue/no-mutating-props
        props.notification.read = true;
        props.notification.update();
    }
    if (props.notification.type === "studentRequest") {
        router.push("/SolveProblems");
    } else if (props.notification.type === "professorRequest") {
        router.push(`/ManageShifts/${(props.currentShift as Shift).id}`);
    } else if (props.notification.type === "system") {
        if (props.notification.systemType === "studentRequest") {
            router.push("/SolveProblems");
        }
    }
};
</script>
