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

import { Shift, ShiftType } from "./Shift.ts";
import { User } from "./User.ts";

export type ProblemType = "unassignedShift" | "request";

export class Problem {
    id: number;
    student: User;
    courseId: number;
    shiftType: ShiftType;
    type: ProblemType;

    // Request only properties
    originalShift?: Shift;
    replacementShift?: Shift;

    constructor(
        id: number,
        student: User,
        courseId: number,
        shiftType: ShiftType,
        type: ProblemType,
        originalShift: Shift | undefined = undefined,
        replacementShift: Shift | undefined = undefined
    ) {
        this.id = id;
        this.student = student;
        this.courseId = courseId;
        this.shiftType = shiftType;
        this.type = type;
        this.originalShift = originalShift;
        this.replacementShift = replacementShift;
    }
}
