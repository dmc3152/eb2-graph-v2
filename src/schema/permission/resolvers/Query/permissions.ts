import { GraphQLError } from 'graphql';
import { RequestContext } from '../../../../context';
import type { QueryResolvers } from './../../../types.generated';
import { safeAsync } from '../../../../utilities/safeAsync';
export const permissions: NonNullable<QueryResolvers['permissions']> = async (_parent, { input }, { dataSources, user }: RequestContext) => {
    if (!user?.sessionId) {
        throw new GraphQLError("User is unauthenticated");
    }

    const [error, permissionsResult] = await safeAsync(dataSources.permission().searchPermissions(input));
    if (error || !permissionsResult) throw new GraphQLError(error?.message || "Could not retrieve permissions");

    const [permissions, pageInfo] = permissionsResult;
    return {
        __typename: "PermissionConnection",
        edges: permissions.map(permission => ({ node: permission })),
        pageInfo
    };
};