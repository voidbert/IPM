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

import { fetchJson } from "./Utils.ts";

export type ShiftType = "T" | "TP" | "PL" | "OT";

export class Shift {
    id: number;
    course: number;
    type: ShiftType;
    number: number;
    professor: number;
    room: number;
    day: number;
    start: number;
    end: number;

    constructor(
        id: number,
        course: number,
        type: ShiftType,
        number: number,
        professor: number,
        room: number,
        day: number,
        start: number,
        end: number
    ) {
        this.id = id;
        this.course = course;
        this.type = type;
        this.number = number;
        this.professor = professor;
        this.room = room;
        this.day = day;
        this.start = start;
        this.end = end;
    }

    get prettyDay(): string {
        return `${this.day + 2}ª feira`;
    }

    get prettyStart(): string {
        return formatTime(this.start);
    }

    get prettyEnd(): string {
        return formatTime(this.end);
    }

    async update(): Promise<void> {
        await fetchJson(`/shifts/${this.id}`, "PUT", this);
    }

    static createFromObject(shiftObject: any): Shift {
        return new Shift(
            Number(shiftObject["id"]),
            shiftObject["course"],
            shiftObject["type"],
            shiftObject["number"],
            shiftObject["professor"],
            shiftObject["room"],
            shiftObject["day"],
            shiftObject["start"],
            shiftObject["end"]
        );
    }

    static async getById(id: number): Promise<Shift | null> {
        try {
            const shift = (await fetchJson(`/shifts/${id}`)) as Record<string, any>;
            return Shift.createFromObject(shift);
        } catch {
            return null;
        }
    }

    static async getAll(): Promise<Shift[]> {
        return (await fetchJson("/shifts")).map(Shift.createFromObject);
    }
}

const formatTime = (time: number) => {
    const hour = Math.floor(time);
    const minute = (time - hour) * 60;
    const hourString = String(hour).padStart(2, "0");
    const minuteString = String(minute).padStart(2, "0");
    return `${hourString}:${minuteString}`;
};
