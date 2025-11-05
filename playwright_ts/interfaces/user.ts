export const UserRole = {
    standard_user: 'standard_user',
    locked_out_user: 'locked_out_user',
    problem_user: 'problem_user',
    performance_glitch_user: 'performance_glitch_user',
    error_user: 'error_user',
    visual_user: 'visual_user',
  } as const;
  
export type UserRoleType = typeof UserRole[keyof typeof UserRole];
