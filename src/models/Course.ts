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

export class Course {
    id: number;
    name: string;
    shortName: string;
    practicalShiftCapacity: number;

    constructor(id: number, name: string, shortName: string, practicalShiftCapacity: number) {
        this.id = id;
        this.name = name;
        this.shortName = shortName;
        this.practicalShiftCapacity = practicalShiftCapacity;
    }

    static createFromObject(courseObject: any): Course {
        return new Course(
            Number(courseObject["id"]),
            courseObject["name"],
            courseObject["shortName"],
            courseObject["practicalShiftCapacity"]
        );
    }

    static async getById(course: number): Promise<Course> {
        return Course.createFromObject(await fetchJson(`/courses/${course}`));
    }

    static async getAll(): Promise<Course[]> {
        return (await fetchJson("/courses")).map(Course.createFromObject);
    }
}
