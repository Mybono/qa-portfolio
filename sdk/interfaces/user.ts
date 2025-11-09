import { ObjectId } from 'mongodb'

export const UserRole = {
    standard_user: 'standard_user',
    locked_out_user: 'locked_out_user',
    problem_user: 'problem_user',
    performance_glitch_user: 'performance_glitch_user',
    error_user: 'error_user',
    visual_user: 'visual_user',
  } as const;
  
export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export interface User {
  _id: ObjectId,
  username: string,
  role: UserRoleType,
  firstName: string,
  lastName:  string,
  postalCode: string,
  email: string,
  phone: string,
  isDeleted: boolean,
  isVisible: boolean
}
