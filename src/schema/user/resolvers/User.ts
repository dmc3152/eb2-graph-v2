import type { UserResolvers } from './../../types.generated';
export const User: UserResolvers = {
  fullName: ({ firstName, lastName }) => `${firstName} ${lastName}`,
  isAdmin: ({ isAdmin }) => isAdmin === 'YES'
};