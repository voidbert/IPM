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

import { Course } from "./Course.ts";
import { Problem } from "./Problem.ts";
import { Notification } from "./Notification.ts";
import { AvailableRoom, Room } from "./Room.ts";
import { Shift } from "./Shift.ts";
import { User } from "./User.ts";

export abstract class Business {
    static async authenticate(email: string, password: string): Promise<User | null> {
        const user = await User.getByEmail(email);
        if (user && user.password === password) {
            return user;
        }

        return null;
    }

    static async publishSchedules(): Promise<void> {
        const users = await User.getAll();
        const director = users.find((u) => u.type === "director") as User;

        const promises = users
            .filter(
                (user) =>
                    JSON.stringify(user.committedSchedule) !== JSON.stringify(user.directorSchedule)
            )
            .map((user) => {
                user.committedSchedule = user.directorSchedule;
                const notification = new Notification(
                    -1,
                    director.id,
                    user.id,
                    new Date(),
                    "publishedSchedules",
                    "pending"
                );

                return Promise.all([user.update(), notification.add()]);
            });

        // Sequence is important here
        for (let i = 0; i < promises.length; ++i) {
            await promises[i];
        }
    }

    private static getUnassignedShiftProblems(
        courses: Course[],
        shifts: Shift[],
        users: User[]
    ): Problem[] {
        // Determine what shift types each course has
        const courseShiftTypes = Object.fromEntries(
            courses.map((course) => [
                course.id,
                new Set(
                    shifts.filter((shift) => shift.course === course.id).map((shift) => shift.type)
                )
            ])
        );

        const problems: Problem[] = [];
        users.forEach((user) => {
            // Determine the shifts a student must go to
            const studentShiftTypes = Object.fromEntries(
                Object.entries(structuredClone(courseShiftTypes)).filter((entry) =>
                    user.enrollments.includes(Number(entry[0]))
                )
            );

            // Remove the shift types the for which the student has a schedule assigned
            user.directorSchedule.forEach((shiftId) => {
                const shift = shifts.find((shift) => shift.id === shiftId) as Shift;
                (studentShiftTypes[shift.course] as Set<string>).delete(shift.type);
            });

            // Create problems for unassigned shifts
            Object.entries(studentShiftTypes).forEach((entry) => {
                const [courseId, shiftTypes] = entry;
                const course = courses.find((course) => course.id === Number(courseId)) as Course;

                shiftTypes.forEach((shiftType) => {
                    problems.push(new Problem(1, user, course.id, shiftType, "unassignedShift"));
                });
            });
        });

        return problems;
    }

    private static async getRequestProblems(shifts: Shift[], users: User[]): Promise<Problem[]> {
        const director = users.find((u) => u.type === "director") as User;
        const notifications = await Notification.getToUser(director.id);

        return notifications
            .filter((notification) => {
                const student = users.find((u) => u.id === notification.from) as User;
                return (
                    notification.type === "studentRequest" &&
                    notification.state !== "rejected" &&
                    student.directorSchedule.includes(notification.fromShift as number)
                );
            })
            .map((notification) => {
                const student = users.find((u) => u.id === notification.from) as User;
                const originalShift = shifts.find((s) => s.id === notification.fromShift) as Shift;
                const replacementShift = shifts.find((s) => s.id === notification.toShift) as Shift;

                return new Problem(
                    1,
                    student,
                    notification.course as number,
                    originalShift.type,
                    "request",
                    originalShift,
                    replacementShift
                );
            });
    }

    static async getProblems(): Promise<Problem[]> {
        const [courses, shifts, users] = await Promise.all([
            Course.getAll(),
            Shift.getAll(),
            User.getAll()
        ]);

        const unassignedShifts = Business.getUnassignedShiftProblems(courses, shifts, users);
        const requests: Problem[] = await Business.getRequestProblems(shifts, users);
        const ret = unassignedShifts.concat(requests).sort((p1, p2) => {
            if (p1.student.specialStatus > p2.student.specialStatus) {
                return -1;
            } else if (p1.student.specialStatus < p2.student.specialStatus) {
                return 1;
            }

            if (p1.type === "unassignedShift" && p2.type == "request") {
                return -1;
            } else if (p1.type == "request" && p2.type === "unassignedShift") {
                return 1;
            }

            return p1.student.name.localeCompare(p2.student.name);
        });

        let id = 1;
        ret.forEach((problem) => {
            problem.id = id;
            id++;
        });

        return ret;
    }

    static async getAlternativeRooms(shift: number): Promise<AvailableRoom[]> {
        // Get necessary data
        const [users, shifts] = await Promise.all([User.getAll(), Shift.getAll()]);

        const replacingShift = shifts.find((s) => s.id === shift) as Shift;
        const minCapacity = users
            .map((user) => user.directorSchedule.filter((shiftId) => shiftId === shift).length)
            .reduce((acc, x) => acc + x, 0);

        const rooms = await Room.getAllWithMinimumCapacity(minCapacity);
        let currentRoom = rooms.find((room) => room.id === replacingShift.room) as Room;
        if (currentRoom === undefined) {
            // Shift over capacity
            currentRoom = (await Room.getById(replacingShift.room)) as Room;
            rooms.push(currentRoom);
        }

        // All rooms with enough capacity are available until proven otherwise
        const available: AvailableRoom[] = rooms.map((room) => ({
            room: room
        }));

        // Function to determine what shifts can change room to accomodate this shift
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
                candidateShift.start < replacingShift.end &&
                replacingShift.start < candidateShift.end &&
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

    static getShiftCapacity(shift: Shift, course: Course, room: Room) {
        if (shift.type === "T") {
            return room.capacity;
        } else {
            return Math.min(room.capacity, course.practicalShiftCapacity);
        }
    }

    static getShiftCapacityReason(shift: Shift, course: Course, room: Room): "room" | "course" {
        if (shift.type === "T" || room.capacity < course.practicalShiftCapacity) {
            return "room";
        } else {
            return "course";
        }
    }
}
