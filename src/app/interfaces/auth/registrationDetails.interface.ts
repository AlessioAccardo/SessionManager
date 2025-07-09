import { UserRole } from "src/app/enum/userRole.enum"

export interface RegistrationDetails {
  first_name: string,
  last_name: string,
  email: string,
  password: string,
  role: UserRole
};