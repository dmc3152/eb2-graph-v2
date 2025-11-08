/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { allAppointmentTypes as Query_allAppointmentTypes } from './calendarEvent/resolvers/Query/allAppointmentTypes';
import    { allAvailabilityBlocks as Query_allAvailabilityBlocks } from './calendarEvent/resolvers/Query/allAvailabilityBlocks';
import    { availabilityBlocks as Query_availabilityBlocks } from './calendarEvent/resolvers/Query/availabilityBlocks';
import    { availableTimeSlots as Query_availableTimeSlots } from './calendarEvent/resolvers/Query/availableTimeSlots';
import    { self as Query_self } from './user/resolvers/Query/self';
import    { users as Query_users } from './user/resolvers/Query/users';
import    { createAppointment as Mutation_createAppointment } from './calendarEvent/resolvers/Mutation/createAppointment';
import    { login as Mutation_login } from './auth/resolvers/Mutation/login';
import    { logout as Mutation_logout } from './auth/resolvers/Mutation/logout';
import    { requestPasswordReset as Mutation_requestPasswordReset } from './auth/resolvers/Mutation/requestPasswordReset';
import    { resendEmailVerification as Mutation_resendEmailVerification } from './auth/resolvers/Mutation/resendEmailVerification';
import    { resetPassword as Mutation_resetPassword } from './auth/resolvers/Mutation/resetPassword';
import    { signUp as Mutation_signUp } from './auth/resolvers/Mutation/signUp';
import    { verifyEmail as Mutation_verifyEmail } from './auth/resolvers/Mutation/verifyEmail';
import    { AppointmentError } from './calendarEvent/resolvers/AppointmentError';
import    { AppointmentPayload } from './calendarEvent/resolvers/AppointmentPayload';
import    { AppointmentType } from './calendarEvent/resolvers/AppointmentType';
import    { AvailabilityBlock } from './calendarEvent/resolvers/AvailabilityBlock';
import    { Calling } from './calling/resolvers/Calling';
import    { LoginError } from './auth/resolvers/LoginError';
import    { LoginPayload } from './auth/resolvers/LoginPayload';
import    { LogoutPayload } from './auth/resolvers/LogoutPayload';
import    { PageInfo } from './base/resolvers/PageInfo';
import    { RequestPasswordResetError } from './auth/resolvers/RequestPasswordResetError';
import    { RequestPasswordResetPayload } from './auth/resolvers/RequestPasswordResetPayload';
import    { ResendEmailVerificationError } from './auth/resolvers/ResendEmailVerificationError';
import    { ResendEmailVerificationPayload } from './auth/resolvers/ResendEmailVerificationPayload';
import    { ResetPasswordError } from './auth/resolvers/ResetPasswordError';
import    { ResetPasswordPayload } from './auth/resolvers/ResetPasswordPayload';
import    { SignUpError } from './auth/resolvers/SignUpError';
import    { SignUpPayload } from './auth/resolvers/SignUpPayload';
import    { TimeSlot } from './calendarEvent/resolvers/TimeSlot';
import    { User } from './user/resolvers/User';
import    { UserConnection } from './user/resolvers/UserConnection';
import    { UserEdge } from './user/resolvers/UserEdge';
import    { VerifyEmailError } from './auth/resolvers/VerifyEmailError';
import    { VerifyEmailPayload } from './auth/resolvers/VerifyEmailPayload';
import    { GenericError } from './calendarEvent/resolvers/GenericError';
import    { DateTimeResolver,EmailAddressResolver } from 'graphql-scalars';
    export const resolvers: Resolvers = {
      Query: { allAppointmentTypes: Query_allAppointmentTypes,allAvailabilityBlocks: Query_allAvailabilityBlocks,availabilityBlocks: Query_availabilityBlocks,availableTimeSlots: Query_availableTimeSlots,self: Query_self,users: Query_users },
      Mutation: { createAppointment: Mutation_createAppointment,login: Mutation_login,logout: Mutation_logout,requestPasswordReset: Mutation_requestPasswordReset,resendEmailVerification: Mutation_resendEmailVerification,resetPassword: Mutation_resetPassword,signUp: Mutation_signUp,verifyEmail: Mutation_verifyEmail },
      
      AppointmentError: AppointmentError,
AppointmentPayload: AppointmentPayload,
AppointmentType: AppointmentType,
AvailabilityBlock: AvailabilityBlock,
Calling: Calling,
LoginError: LoginError,
LoginPayload: LoginPayload,
LogoutPayload: LogoutPayload,
PageInfo: PageInfo,
RequestPasswordResetError: RequestPasswordResetError,
RequestPasswordResetPayload: RequestPasswordResetPayload,
ResendEmailVerificationError: ResendEmailVerificationError,
ResendEmailVerificationPayload: ResendEmailVerificationPayload,
ResetPasswordError: ResetPasswordError,
ResetPasswordPayload: ResetPasswordPayload,
SignUpError: SignUpError,
SignUpPayload: SignUpPayload,
TimeSlot: TimeSlot,
User: User,
UserConnection: UserConnection,
UserEdge: UserEdge,
VerifyEmailError: VerifyEmailError,
VerifyEmailPayload: VerifyEmailPayload,
GenericError: GenericError,
DateTime: DateTimeResolver,
EmailAddress: EmailAddressResolver
    }