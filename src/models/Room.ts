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

import { Shift } from "./Shift.ts";
import { fetchJson } from "./Utils.ts";

export class Room {
    id: number;
    name: string;
    capacity: number;

    constructor(id: number, name: string, capacity: number) {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
    }

    static createFromObject(roomObject: any): Room {
        return new Room(Number(roomObject["id"]), roomObject["name"], roomObject["capacity"]);
    }

    static async getById(id: number): Promise<Room | null> {
        try {
            const room = (await fetchJson(`/rooms/${id}`)) as Record<string, any>;
            return Room.createFromObject(room);
        } catch {
            return null;
        }
    }

    static async getAllWithMinimumCapacity(capacity: number): Promise<Room[]> {
        return (await fetchJson(`/rooms?capacity_gte=${capacity}`)).map(Room.createFromObject);
    }
}

export interface AvailableRoom {
    room: Room;
    replaces?: Shift;
}
