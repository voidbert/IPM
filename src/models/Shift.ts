type Day = "Segunda" | "Terça" | "Quarta" | "Quinta" | "Sexta";

interface Shift {
    start: number;
    end: number;
    name: string;
}

interface ShiftBlock {
    from: number;
    to: number;
    shifts: Shift[];
}

type WeekSchedule = Record<Day, ShiftBlock[]>;

export { WeekSchedule, ShiftBlock, Shift, Day };