import { Category } from "./category";

export type Task = {
    id: number,
    content: string,
    status: string,
    category: Category,
    assignees: number[],
    assignee_names: string[],
    count: number,
    startDate: string,
    deadline: string,
    createdAt: string,
    assigner: {
        id: number,
        name: string,
    },
    mainHandler: {
        id: number,
        name: string,
        avatar: string,
    },
    description: string,
}