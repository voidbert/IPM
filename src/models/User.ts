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

export type UserType = "student" | "professor" | "director";

export class User {
    // Common attributes
    public id: number;
    public email: string;
    public password: string;
    public type: UserType;
    public name: string;
    public profilePicture: string | null;

    // Student-only attributes
    number: string | null;
    enrollments: number[];
    schedule: number[];

    constructor(
        id: number,
        email: string,
        password: string,
        type: UserType,
        name: string,
        profilePicture: string | null = null,
        number: string | null = null,
        enrollments: number[] = [],
        schedule: number[] = []
    ) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.type = type;
        this.name = name;
        this.profilePicture = profilePicture;
        this.number = number;
        this.enrollments = enrollments;
        this.schedule = schedule;
    }

    static createFromObject(userObject: any): User {
        return new User(
            userObject["id"],
            userObject["email"],
            userObject["password"],
            userObject["type"],
            userObject["name"],
            userObject["profilePicture"],
            userObject["number"],
            userObject["enrollments"],
            userObject["schedule"]
        );
    }

    static async tryAuthenticate(email: string, password: string): Promise<User | null> {
        const users = (await fetchJson(`/users?email=${email}&password=${password}`)) as any[];
        return users.length == 1 ? User.createFromObject(users[0]) : null;
    }

    static async getUsersPublicInfo(ids: number[]): Promise<Record<number, User>> {
        let usersPublic:User[] = [];
        if (ids.length > 0) {
            let query = `/users?id=${ids.pop()}`;
            ids.forEach(id => query += `&id=${id}`)
            const usersPrivate = await fetchJson(query, "GET") as any[];
            usersPrivate.forEach(u => {
                usersPublic.push(User.createFromObject({
                    "id": u["id"],
                    "email": u["email"],
                    "type": u["type"],
                    "name": u["name"],
                    "profilePicture": u["profilePicture"],
                    "number": u["number"]
                }))
            })
        }
        return usersPublic;
    }
}
