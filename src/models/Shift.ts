type Day = "Segunda" | "Terça" | "Quarta" | "Quinta" | "Sexta";

interface ShiftType {
    start: number;
    end: number;
    name: string;
}

interface ShiftBlockType {
    from: number;
    to: number;
    divisions: number;
    shifts: ShiftType[];
}

type WeekSchedule = Record<Day, ShiftBlockType[]>;

export { WeekSchedule, ShiftBlockType, ShiftType, Day };