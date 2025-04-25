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
import { User } from "./User.ts";
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

    static async getAlternatives(shift: number): Promise<AvailableRoom[]> {
        // Get necessary data
        const [users, shifts] = await Promise.all([User.getAll(), Shift.getAll()]);

        const replacingShift = shifts.find((s) => s.id === shift) as Shift;
        const minCapacity = users
            .map((user) => user.directorSchedule.filter((shiftId) => shiftId === shift).length)
            .reduce((acc, x) => acc + x, 0);

        const rooms = await Room.getAllWithMinimumCapacity(minCapacity);

        // All rooms with enough capacity are available until proven otherwise
        const available: AvailableRoom[] = rooms.map((room) => ({
            room: room
        }));

        // Function to determine what shifts can change room to accomodate this shift
        const currentRoom = rooms.find((room) => room.id === replacingShift.room) as Room;
        const currentCapacity = currentRoom.capacity;

        const isSwapPossible = (candidateShift: Shift) => {
            const attendence = users
                .map(
                    (user) =>
                        user.directorSchedule.filter((shiftId) => shiftId === candidateShift.id)
                            .length
                )
                .reduce((acc, x) => acc + x, 0);

            return (
                candidateShift.day === replacingShift.day &&
                candidateShift.start <= replacingShift.end &&
                replacingShift.start <= candidateShift.end &&
                attendence <= currentCapacity
            );
        };

        // Set which rooms have shifts at the same time
        shifts
            .filter((shift) => isSwapPossible(shift))
            .forEach((shift) => {
                const room = available.find((room) => room.room.id === shift.room);
                if (room !== undefined) {
                    // Check for rooms with not enough capacity
                    room.replaces = shift;
                }
            });

        // Sort for better presentation
        return available.sort((a1, a2) => {
            if (a1.room.id === replacingShift.room) {
                return -1;
            } else if (a2.room.id === replacingShift.room) {
                return 1;
            }

            if (a1.replaces && !a2.replaces) {
                return 1;
            } else if (a2.replaces && !a1.replaces) {
                return -1;
            }

            const delta = a1.room.capacity - a2.room.capacity;
            if (delta != 0) {
                return delta;
            } else {
                return a1.room.name.localeCompare(a2.room.name);
            }
        });
    }

    static async getById(room: number): Promise<Room> {
        return Room.createFromObject(await fetchJson(`/rooms/${room}`));
    }

    static async getAllWithMinimumCapacity(capacity: number): Promise<Room[]> {
        return (await fetchJson(`/rooms?capacity_gte=${capacity}`)).map(Room.createFromObject);
    }
}

export interface AvailableRoom {
    room: Room;
    replaces?: Shift;
}
