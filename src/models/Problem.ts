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
import { Shift } from "./Shift.ts";
import { User } from "./User.ts";

export type ProblemType = "unassignedShift" | "request";

export class Problem {
    student: User;
    description: string;
    type: ProblemType;

    constructor(student: User, description: string, type: ProblemType) {
        this.student = student;
        this.description = description;
        this.type = type;
    }

    static async getUnassignedShifts(
        courses: Course[],
        shifts: Shift[],
        users: User[]
    ): Promise<Problem[]> {
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
            // Determine the shift a student must go to
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
                    problems.push(
                        new Problem(
                            user,
                            `${course.shortName} ${shiftType} (por atribuir)`,
                            "unassignedShift"
                        )
                    );
                });
            });
        });

        return problems;
    }

    static async getRequests(): Promise<Problem[]> {
        // TODO - get problems (requests) from notifications
        return [];
    }

    static async getAll(): Promise<Problem[]> {
        const [courses, shifts, users] = await Promise.all([
            Course.getAll(),
            Shift.getAll(),
            User.getAll()
        ]);

        const [unassignedShifts, requests] = await Promise.all([
            Problem.getUnassignedShifts(courses, shifts, users),
            Problem.getRequests()
        ]);

        return unassignedShifts.concat(requests).sort((p1, p2) => {
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
    }
}
