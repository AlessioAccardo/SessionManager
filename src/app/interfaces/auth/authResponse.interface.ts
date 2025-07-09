import { UserRole } from "src/app/enum/userRole.enum";

export interface AuthResponse {
    token: string;
    data: {
        first_name: string;
        last_name: string;
        email: string,
        role: UserRole;
    }
};