export interface LoggedUser {
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    role: string,
    credits?: number,
    mean?: number
}