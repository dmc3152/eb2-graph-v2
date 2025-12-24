/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { allAppointmentTypes as Query_allAppointmentTypes } from './calendarEvent/resolvers/Query/allAppointmentTypes';
import    { allAvailabilityBlocks as Query_allAvailabilityBlocks } from './calendarEvent/resolvers/Query/allAvailabilityBlocks';
import    { availabilityBlocks as Query_availabilityBlocks } from './calendarEvent/resolvers/Query/availabilityBlocks';
import    { availableTimeSlots as Query_availableTimeSlots } from './calendarEvent/resolvers/Query/availableTimeSlots';
import    { callings as Query_callings } from './calling/resolvers/Query/callings';
import    { currentGame as Query_currentGame } from './trivia/resolvers/Query/currentGame';
import    { myTriviaScore as Query_myTriviaScore } from './trivia/resolvers/Query/myTriviaScore';
import    { permissions as Query_permissions } from './permission/resolvers/Query/permissions';
import    { self as Query_self } from './user/resolvers/Query/self';
import    { users as Query_users } from './user/resolvers/Query/users';
import    { addCallingsToPermission as Mutation_addCallingsToPermission } from './permission/resolvers/Mutation/addCallingsToPermission';
import    { changeMyTriviaPlayerName as Mutation_changeMyTriviaPlayerName } from './trivia/resolvers/Mutation/changeMyTriviaPlayerName';
import    { closeTriviaGame as Mutation_closeTriviaGame } from './trivia/resolvers/Mutation/closeTriviaGame';
import    { createAppointment as Mutation_createAppointment } from './calendarEvent/resolvers/Mutation/createAppointment';
import    { createPermission as Mutation_createPermission } from './permission/resolvers/Mutation/createPermission';
import    { createTriviaGame as Mutation_createTriviaGame } from './trivia/resolvers/Mutation/createTriviaGame';
import    { deletePermission as Mutation_deletePermission } from './permission/resolvers/Mutation/deletePermission';
import    { login as Mutation_login } from './auth/resolvers/Mutation/login';
import    { logout as Mutation_logout } from './auth/resolvers/Mutation/logout';
import    { nextTriviaQuestion as Mutation_nextTriviaQuestion } from './trivia/resolvers/Mutation/nextTriviaQuestion';
import    { pauseTriviaGame as Mutation_pauseTriviaGame } from './trivia/resolvers/Mutation/pauseTriviaGame';
import    { removeCallingsFromPermission as Mutation_removeCallingsFromPermission } from './permission/resolvers/Mutation/removeCallingsFromPermission';
import    { requestPasswordReset as Mutation_requestPasswordReset } from './auth/resolvers/Mutation/requestPasswordReset';
import    { resendEmailVerification as Mutation_resendEmailVerification } from './auth/resolvers/Mutation/resendEmailVerification';
import    { resetPassword as Mutation_resetPassword } from './auth/resolvers/Mutation/resetPassword';
import    { resumeTriviaGame as Mutation_resumeTriviaGame } from './trivia/resolvers/Mutation/resumeTriviaGame';
import    { showScoreAfterQuestion as Mutation_showScoreAfterQuestion } from './trivia/resolvers/Mutation/showScoreAfterQuestion';
import    { showScoreImmediately as Mutation_showScoreImmediately } from './trivia/resolvers/Mutation/showScoreImmediately';
import    { signUp as Mutation_signUp } from './auth/resolvers/Mutation/signUp';
import    { startTriviaGame as Mutation_startTriviaGame } from './trivia/resolvers/Mutation/startTriviaGame';
import    { stopTriviaGame as Mutation_stopTriviaGame } from './trivia/resolvers/Mutation/stopTriviaGame';
import    { submitTriviaAnswer as Mutation_submitTriviaAnswer } from './trivia/resolvers/Mutation/submitTriviaAnswer';
import    { verifyEmail as Mutation_verifyEmail } from './auth/resolvers/Mutation/verifyEmail';
import    { joinTriviaGameAsAdmin as Subscription_joinTriviaGameAsAdmin } from './trivia/resolvers/Subscription/joinTriviaGameAsAdmin';
import    { joinTriviaGameAsBoard as Subscription_joinTriviaGameAsBoard } from './trivia/resolvers/Subscription/joinTriviaGameAsBoard';
import    { joinTriviaGameAsPlayer as Subscription_joinTriviaGameAsPlayer } from './trivia/resolvers/Subscription/joinTriviaGameAsPlayer';
import    { AppointmentError } from './calendarEvent/resolvers/AppointmentError';
import    { AppointmentPayload } from './calendarEvent/resolvers/AppointmentPayload';
import    { AppointmentType } from './calendarEvent/resolvers/AppointmentType';
import    { AvailabilityBlock } from './calendarEvent/resolvers/AvailabilityBlock';
import    { Calling } from './calling/resolvers/Calling';
import    { CallingConnection } from './calling/resolvers/CallingConnection';
import    { CallingEdge } from './calling/resolvers/CallingEdge';
import    { LoginError } from './auth/resolvers/LoginError';
import    { LoginPayload } from './auth/resolvers/LoginPayload';
import    { LogoutPayload } from './auth/resolvers/LogoutPayload';
import    { PageInfo } from './base/resolvers/PageInfo';
import    { Permission } from './permission/resolvers/Permission';
import    { PermissionAssociateCallingsError } from './permission/resolvers/PermissionAssociateCallingsError';
import    { PermissionAssociateCallingsPayload } from './permission/resolvers/PermissionAssociateCallingsPayload';
import    { PermissionConnection } from './permission/resolvers/PermissionConnection';
import    { PermissionDeleteError } from './permission/resolvers/PermissionDeleteError';
import    { PermissionDeletePayload } from './permission/resolvers/PermissionDeletePayload';
import    { PermissionEdge } from './permission/resolvers/PermissionEdge';
import    { PermissionError } from './permission/resolvers/PermissionError';
import    { PermissionPayload } from './permission/resolvers/PermissionPayload';
import    { PermissionRemoveCallingsPayload } from './permission/resolvers/PermissionRemoveCallingsPayload';
import    { PlayerScore } from './trivia/resolvers/PlayerScore';
import    { RequestPasswordResetError } from './auth/resolvers/RequestPasswordResetError';
import    { RequestPasswordResetPayload } from './auth/resolvers/RequestPasswordResetPayload';
import    { ResendEmailVerificationError } from './auth/resolvers/ResendEmailVerificationError';
import    { ResendEmailVerificationPayload } from './auth/resolvers/ResendEmailVerificationPayload';
import    { ResetPasswordError } from './auth/resolvers/ResetPasswordError';
import    { ResetPasswordPayload } from './auth/resolvers/ResetPasswordPayload';
import    { SignUpError } from './auth/resolvers/SignUpError';
import    { SignUpPayload } from './auth/resolvers/SignUpPayload';
import    { TimeSlot } from './calendarEvent/resolvers/TimeSlot';
import    { TriviaGame } from './trivia/resolvers/TriviaGame';
import    { TriviaGameError } from './trivia/resolvers/TriviaGameError';
import    { TriviaGamePayload } from './trivia/resolvers/TriviaGamePayload';
import    { TriviaGameScore } from './trivia/resolvers/TriviaGameScore';
import    { TriviaGameUpdateForAdmin } from './trivia/resolvers/TriviaGameUpdateForAdmin';
import    { TriviaGameUpdateForBoard } from './trivia/resolvers/TriviaGameUpdateForBoard';
import    { TriviaGameUpdateForPlayer } from './trivia/resolvers/TriviaGameUpdateForPlayer';
import    { TriviaOption } from './trivia/resolvers/TriviaOption';
import    { TriviaPlayerScore } from './trivia/resolvers/TriviaPlayerScore';
import    { TriviaQuestion } from './trivia/resolvers/TriviaQuestion';
import    { User } from './user/resolvers/User';
import    { UserConnection } from './user/resolvers/UserConnection';
import    { UserEdge } from './user/resolvers/UserEdge';
import    { VerifyEmailError } from './auth/resolvers/VerifyEmailError';
import    { VerifyEmailPayload } from './auth/resolvers/VerifyEmailPayload';
import    { GenericError } from './calendarEvent/resolvers/GenericError';
import    { DateTimeResolver,EmailAddressResolver } from 'graphql-scalars';
    export const resolvers: Resolvers = {
      Query: { allAppointmentTypes: Query_allAppointmentTypes,allAvailabilityBlocks: Query_allAvailabilityBlocks,availabilityBlocks: Query_availabilityBlocks,availableTimeSlots: Query_availableTimeSlots,callings: Query_callings,currentGame: Query_currentGame,myTriviaScore: Query_myTriviaScore,permissions: Query_permissions,self: Query_self,users: Query_users },
      Mutation: { addCallingsToPermission: Mutation_addCallingsToPermission,changeMyTriviaPlayerName: Mutation_changeMyTriviaPlayerName,closeTriviaGame: Mutation_closeTriviaGame,createAppointment: Mutation_createAppointment,createPermission: Mutation_createPermission,createTriviaGame: Mutation_createTriviaGame,deletePermission: Mutation_deletePermission,login: Mutation_login,logout: Mutation_logout,nextTriviaQuestion: Mutation_nextTriviaQuestion,pauseTriviaGame: Mutation_pauseTriviaGame,removeCallingsFromPermission: Mutation_removeCallingsFromPermission,requestPasswordReset: Mutation_requestPasswordReset,resendEmailVerification: Mutation_resendEmailVerification,resetPassword: Mutation_resetPassword,resumeTriviaGame: Mutation_resumeTriviaGame,showScoreAfterQuestion: Mutation_showScoreAfterQuestion,showScoreImmediately: Mutation_showScoreImmediately,signUp: Mutation_signUp,startTriviaGame: Mutation_startTriviaGame,stopTriviaGame: Mutation_stopTriviaGame,submitTriviaAnswer: Mutation_submitTriviaAnswer,verifyEmail: Mutation_verifyEmail },
      Subscription: { joinTriviaGameAsAdmin: Subscription_joinTriviaGameAsAdmin,joinTriviaGameAsBoard: Subscription_joinTriviaGameAsBoard,joinTriviaGameAsPlayer: Subscription_joinTriviaGameAsPlayer },
      AppointmentError: AppointmentError,
AppointmentPayload: AppointmentPayload,
AppointmentType: AppointmentType,
AvailabilityBlock: AvailabilityBlock,
Calling: Calling,
CallingConnection: CallingConnection,
CallingEdge: CallingEdge,
LoginError: LoginError,
LoginPayload: LoginPayload,
LogoutPayload: LogoutPayload,
PageInfo: PageInfo,
Permission: Permission,
PermissionAssociateCallingsError: PermissionAssociateCallingsError,
PermissionAssociateCallingsPayload: PermissionAssociateCallingsPayload,
PermissionConnection: PermissionConnection,
PermissionDeleteError: PermissionDeleteError,
PermissionDeletePayload: PermissionDeletePayload,
PermissionEdge: PermissionEdge,
PermissionError: PermissionError,
PermissionPayload: PermissionPayload,
PermissionRemoveCallingsPayload: PermissionRemoveCallingsPayload,
PlayerScore: PlayerScore,
RequestPasswordResetError: RequestPasswordResetError,
RequestPasswordResetPayload: RequestPasswordResetPayload,
ResendEmailVerificationError: ResendEmailVerificationError,
ResendEmailVerificationPayload: ResendEmailVerificationPayload,
ResetPasswordError: ResetPasswordError,
ResetPasswordPayload: ResetPasswordPayload,
SignUpError: SignUpError,
SignUpPayload: SignUpPayload,
TimeSlot: TimeSlot,
TriviaGame: TriviaGame,
TriviaGameError: TriviaGameError,
TriviaGamePayload: TriviaGamePayload,
TriviaGameScore: TriviaGameScore,
TriviaGameUpdateForAdmin: TriviaGameUpdateForAdmin,
TriviaGameUpdateForBoard: TriviaGameUpdateForBoard,
TriviaGameUpdateForPlayer: TriviaGameUpdateForPlayer,
TriviaOption: TriviaOption,
TriviaPlayerScore: TriviaPlayerScore,
TriviaQuestion: TriviaQuestion,
User: User,
UserConnection: UserConnection,
UserEdge: UserEdge,
VerifyEmailError: VerifyEmailError,
VerifyEmailPayload: VerifyEmailPayload,
GenericError: GenericError,
DateTime: DateTimeResolver,
EmailAddress: EmailAddressResolver
    }