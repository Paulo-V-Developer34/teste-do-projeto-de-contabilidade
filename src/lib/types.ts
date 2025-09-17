export type FormState = {
    message: string,
    errors?: {
        userName: string[]
    }
}

export type User = {
    name: string,
    id: number,
    email: string
}