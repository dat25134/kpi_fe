import { Category } from "./category";

export interface TaskFile {
    id: number;
    name: string;
    url: string;
    size: number;
    mime_type: string;
}

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
    files?: TaskFile[],
    subtasks?: Task[],
}

export interface ProgressUser {
    id: number
    name: string
    avatar?: string
}

export interface ProgressItem {
    id?: number
    user: ProgressUser | string
    time: string
    contentProgress: string
}

export interface TaskProgressPanelProps {
    progressHistory: ProgressItem[]
    status: string
    setStatus: (status: string) => void
    onAddProgress: (item: ProgressItem) => void
    refreshTasks: () => void
    setErrorMsg: (errorMsg: Record<string, string[]>) => void
    errorMsg: Record<string, string[]>
    isCompletedTask: boolean
}