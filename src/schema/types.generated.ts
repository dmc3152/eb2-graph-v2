import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { AvailabilityBlockMapper } from './calendarEvent/schema.mappers';
import { CallingMapper } from './calling/schema.mappers';
import { PermissionMapper } from './permission/schema.mappers';
import { UserMapper } from './user/schema.mappers';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type EnumResolverSignature<T, AllowedValues = any> = { [key in keyof T]?: AllowedValues };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string | number; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: Date | string; output: Date | string; }
  EmailAddress: { input: string; output: string; }
};

export type AppointmentDetails = {
  bishopricMember: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  timeSlot: AppointmentTimeSlot;
};

export type AppointmentError = GenericError & {
  __typename?: 'AppointmentError';
  code?: Maybe<AppointmentErrorCodes>;
  message?: Maybe<Scalars['String']['output']>;
};

export type AppointmentErrorCodes =
  | 'APPOINTMENT_CONFLICT'
  | 'APPOINTMENT_TYPE_NOT_FOUND'
  | 'INVALID_TIME_SLOT'
  | 'UNKNOWN_ERROR';

export type AppointmentPayload = {
  __typename?: 'AppointmentPayload';
  bishopricMember?: Maybe<Scalars['ID']['output']>;
  error?: Maybe<AppointmentError>;
  success: Scalars['Boolean']['output'];
  timeSlot?: Maybe<TimeSlot>;
};

export type AppointmentTimeSlot = {
  end: Scalars['DateTime']['input'];
  start: Scalars['DateTime']['input'];
};

export type AppointmentType = {
  __typename?: 'AppointmentType';
  description?: Maybe<Scalars['String']['output']>;
  durationInMinutes: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  interviewers: Array<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
};

export type AvailabilityBlock = {
  __typename?: 'AvailabilityBlock';
  availableSlot?: Maybe<TimeSlot>;
  bishopricMember?: Maybe<Scalars['ID']['output']>;
  end?: Maybe<Scalars['DateTime']['output']>;
  priorityDirection?: Maybe<PriorityDirection>;
  start?: Maybe<Scalars['DateTime']['output']>;
};


export type AvailabilityBlockavailableSlotArgs = {
  durationInMinutes: Scalars['Int']['input'];
};

export type Calling = {
  __typename?: 'Calling';
  assignedTo: Array<User>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  permissions: Array<Permission>;
};

export type CallingConnection = {
  __typename?: 'CallingConnection';
  edges: Array<CallingEdge>;
  pageInfo: PageInfo;
};

export type CallingEdge = {
  __typename?: 'CallingEdge';
  node: Calling;
};

export type CallingFilters = {
  isAssigned?: InputMaybe<Scalars['Boolean']['input']>;
  nameContains?: InputMaybe<Scalars['String']['input']>;
};

export type CallingSearch = {
  filters?: InputMaybe<CallingFilters>;
  paging?: InputMaybe<OffsetPaging>;
};

export type Credentials = {
  email: Scalars['EmailAddress']['input'];
  password: Scalars['String']['input'];
};

export type GenericError = {
  message?: Maybe<Scalars['String']['output']>;
};

export type LoginError = GenericError & {
  __typename?: 'LoginError';
  code?: Maybe<LoginErrorCodes>;
  message?: Maybe<Scalars['String']['output']>;
};

export type LoginErrorCodes =
  | 'INVALID_CREDENTIALS'
  | 'UNKNOWN_ERROR'
  | 'USER_NOT_FOUND';

export type LoginPayload = {
  __typename?: 'LoginPayload';
  error?: Maybe<LoginError>;
  success: Scalars['Boolean']['output'];
  user?: Maybe<User>;
};

export type LogoutPayload = {
  __typename?: 'LogoutPayload';
  success: Scalars['Boolean']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changeMyTriviaPlayerName: TriviaGamePayload;
  closeTriviaGame: TriviaGamePayload;
  createAppointment: AppointmentPayload;
  createTriviaGame: TriviaGamePayload;
  login: LoginPayload;
  logout: LogoutPayload;
  nextTriviaQuestion: TriviaGamePayload;
  pauseTriviaGame: TriviaGamePayload;
  requestPasswordReset: RequestPasswordResetPayload;
  resendEmailVerification: ResendEmailVerificationPayload;
  resetPassword: ResetPasswordPayload;
  resumeTriviaGame: TriviaGamePayload;
  showScoreAfterQuestion: TriviaGamePayload;
  showScoreImmediately: TriviaGamePayload;
  signUp: SignUpPayload;
  startTriviaGame: TriviaGamePayload;
  stopTriviaGame: TriviaGamePayload;
  submitTriviaAnswer: TriviaGamePayload;
  verifyEmail: VerifyEmailPayload;
};


export type MutationchangeMyTriviaPlayerNameArgs = {
  newName: Scalars['String']['input'];
};


export type MutationcreateAppointmentArgs = {
  input: AppointmentDetails;
};


export type MutationcreateTriviaGameArgs = {
  gameId: Scalars['ID']['input'];
};


export type MutationloginArgs = {
  input: Credentials;
};


export type MutationrequestPasswordResetArgs = {
  email: Scalars['EmailAddress']['input'];
};


export type MutationresendEmailVerificationArgs = {
  email: Scalars['EmailAddress']['input'];
};


export type MutationresetPasswordArgs = {
  input: ResetPasswordDetails;
};


export type MutationsignUpArgs = {
  input: SignUpDetails;
};


export type MutationstartTriviaGameArgs = {
  gameId: Scalars['ID']['input'];
};


export type MutationsubmitTriviaAnswerArgs = {
  answer: TriviaAnswer;
};


export type MutationverifyEmailArgs = {
  code: Scalars['Int']['input'];
  email: Scalars['EmailAddress']['input'];
};

export type OffsetPaging = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  hasNextPage: Scalars['Boolean']['output'];
  pageOffset: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
};

export type Permission = {
  __typename?: 'Permission';
  callings: Array<Calling>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type PermissionConnection = {
  __typename?: 'PermissionConnection';
  edges: Array<PermissionEdge>;
  pageInfo: PageInfo;
};

export type PermissionEdge = {
  __typename?: 'PermissionEdge';
  node: Permission;
};

export type PermissionFilters = {
  callingIsNotOneOf?: InputMaybe<Array<Scalars['ID']['input']>>;
  callingIsOneOf?: InputMaybe<Array<Scalars['ID']['input']>>;
  nameContains?: InputMaybe<Scalars['String']['input']>;
};

export type PermissionSearch = {
  filters?: InputMaybe<PermissionFilters>;
  paging?: InputMaybe<OffsetPaging>;
};

export type PlayerScore = {
  __typename?: 'PlayerScore';
  playerName: Scalars['String']['output'];
  score: Scalars['Int']['output'];
};

export type PriorityDirection =
  | 'ASC'
  | 'DESC';

export type Query = {
  __typename?: 'Query';
  allAppointmentTypes: Array<AppointmentType>;
  allAvailabilityBlocks: Array<AvailabilityBlock>;
  availabilityBlocks: Array<AvailabilityBlock>;
  availableTimeSlots: Array<Maybe<TimeSlot>>;
  callings?: Maybe<CallingConnection>;
  currentGame?: Maybe<TriviaGame>;
  myTriviaScore: Array<TriviaPlayerScore>;
  permissions?: Maybe<PermissionConnection>;
  self?: Maybe<User>;
  users?: Maybe<UserConnection>;
};


export type QueryavailabilityBlocksArgs = {
  bishopricMember: Scalars['ID']['input'];
};


export type QueryavailableTimeSlotsArgs = {
  bishopricMember: Scalars['ID']['input'];
  durationInMinutes: Scalars['Int']['input'];
};


export type QuerycallingsArgs = {
  input?: InputMaybe<CallingSearch>;
};


export type QuerypermissionsArgs = {
  input?: InputMaybe<PermissionSearch>;
};


export type QueryusersArgs = {
  input?: InputMaybe<UserSearch>;
};

export type RequestPasswordResetError = GenericError & {
  __typename?: 'RequestPasswordResetError';
  code?: Maybe<RequestPasswordResetErrorCodes>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RequestPasswordResetErrorCodes =
  | 'COULD_NOT_CREATE'
  | 'COULD_NOT_UPDATE'
  | 'EMAIL_ERROR'
  | 'NOT_FOUND'
  | 'PASSWORD_RESET_AGENT_AUTHENTICATION_FAILED'
  | 'UNKNOWN_ERROR';

export type RequestPasswordResetPayload = {
  __typename?: 'RequestPasswordResetPayload';
  error?: Maybe<RequestPasswordResetError>;
  success: Scalars['Boolean']['output'];
};

export type ResendEmailVerificationError = GenericError & {
  __typename?: 'ResendEmailVerificationError';
  code?: Maybe<ResendEmailVerificationErrorCodes>;
  message?: Maybe<Scalars['String']['output']>;
};

export type ResendEmailVerificationErrorCodes =
  | 'COULD_NOT_CREATE'
  | 'COULD_NOT_UPDATE'
  | 'EMAIL_ALREADY_VERIFIED'
  | 'EMAIL_ERROR'
  | 'EMAIL_VERIFIER_AUTHENTICATION_FAILED'
  | 'NOT_FOUND'
  | 'UNKNOWN_ERROR';

export type ResendEmailVerificationPayload = {
  __typename?: 'ResendEmailVerificationPayload';
  error?: Maybe<ResendEmailVerificationError>;
  success: Scalars['Boolean']['output'];
};

export type ResetPasswordDetails = {
  code: Scalars['Int']['input'];
  email: Scalars['EmailAddress']['input'];
  password: Scalars['String']['input'];
};

export type ResetPasswordError = GenericError & {
  __typename?: 'ResetPasswordError';
  code?: Maybe<ResetPasswordErrorCodes>;
  message?: Maybe<Scalars['String']['output']>;
};

export type ResetPasswordErrorCodes =
  | 'CODE_EXPIRED'
  | 'CODE_INVALID'
  | 'DELETE_ERROR'
  | 'NOT_FOUND'
  | 'PASSWORD_RESET_AGENT_AUTHENTICATION_FAILED'
  | 'RESET_ERROR'
  | 'UNKNOWN_ERROR';

export type ResetPasswordPayload = {
  __typename?: 'ResetPasswordPayload';
  error?: Maybe<ResetPasswordError>;
  success: Scalars['Boolean']['output'];
};

export type SignUpDetails = {
  email: Scalars['EmailAddress']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignUpError = GenericError & {
  __typename?: 'SignUpError';
  code?: Maybe<SignUpErrorCodes>;
  message?: Maybe<Scalars['String']['output']>;
};

export type SignUpErrorCodes =
  | 'EMAIL_ERROR'
  | 'EMAIL_VERIFIER_AUTHENTICATION_FAILED'
  | 'INVALID_CREDENTIALS'
  | 'INVALID_PASSWORD_CHARACTER'
  | 'INVALID_PASSWORD_LENGTH'
  | 'MISSING_CAPITAL_LETTER'
  | 'MISSING_LOWERCASE_LETTER'
  | 'MISSING_NUMBER'
  | 'NOT_FOUND'
  | 'UNKNOWN_ERROR';

export type SignUpPayload = {
  __typename?: 'SignUpPayload';
  error?: Maybe<SignUpError>;
  success: Scalars['Boolean']['output'];
};

export type SortDirection =
  | 'ASC'
  | 'DESC';

export type Subscription = {
  __typename?: 'Subscription';
  joinTriviaGameAsAdmin: TriviaGameUpdateForAdmin;
  joinTriviaGameAsBoard: TriviaGameUpdateForBoard;
  joinTriviaGameAsPlayer: TriviaGameUpdateForPlayer;
};

export type TimeSlot = {
  __typename?: 'TimeSlot';
  end?: Maybe<Scalars['DateTime']['output']>;
  start?: Maybe<Scalars['DateTime']['output']>;
};

export type TriviaAnswer =
  | 'A'
  | 'B'
  | 'C'
  | 'D';

export type TriviaGame = {
  __typename?: 'TriviaGame';
  id: Scalars['ID']['output'];
};

export type TriviaGameError = GenericError & {
  __typename?: 'TriviaGameError';
  code?: Maybe<TriviaGameErrorCodes>;
  message?: Maybe<Scalars['String']['output']>;
};

export type TriviaGameErrorCodes =
  | 'GAME_ALREADY_EXISTS'
  | 'GAME_NOT_FOUND'
  | 'INSUFFICIENT_PERMISSIONS'
  | 'UNKNOWN_ERROR';

export type TriviaGamePayload = {
  __typename?: 'TriviaGamePayload';
  error?: Maybe<TriviaGameError>;
  success: Scalars['Boolean']['output'];
};

export type TriviaGameScore = {
  __typename?: 'TriviaGameScore';
  category: Scalars['String']['output'];
  scores: Array<PlayerScore>;
};

export type TriviaGameState =
  | 'ANSWER'
  | 'CLOSED'
  | 'PAUSED'
  | 'QUESTION'
  | 'SCORE'
  | 'SPLASH'
  | 'STOPPED';

export type TriviaGameUpdateForAdmin = {
  __typename?: 'TriviaGameUpdateForAdmin';
  question?: Maybe<TriviaQuestion>;
  state: TriviaGameState;
  time?: Maybe<Scalars['Int']['output']>;
};

export type TriviaGameUpdateForBoard = {
  __typename?: 'TriviaGameUpdateForBoard';
  question?: Maybe<TriviaQuestion>;
  scores?: Maybe<Array<TriviaGameScore>>;
  state: TriviaGameState;
  time?: Maybe<Scalars['Int']['output']>;
};

export type TriviaGameUpdateForPlayer = {
  __typename?: 'TriviaGameUpdateForPlayer';
  question?: Maybe<TriviaQuestion>;
  state: TriviaGameState;
  time?: Maybe<Scalars['Int']['output']>;
};

export type TriviaOption = {
  __typename?: 'TriviaOption';
  option: TriviaAnswer;
  text: Scalars['String']['output'];
};

export type TriviaPlayerScore = {
  __typename?: 'TriviaPlayerScore';
  category: Scalars['String']['output'];
  score: Scalars['Int']['output'];
};

export type TriviaQuestion = {
  __typename?: 'TriviaQuestion';
  category: Scalars['String']['output'];
  correctAnswer?: Maybe<TriviaAnswer>;
  options: Array<TriviaOption>;
  question: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  callings: Array<Calling>;
  email: Scalars['EmailAddress']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isSiteAdmin?: Maybe<Scalars['Boolean']['output']>;
  lastName: Scalars['String']['output'];
};

export type UserConnection = {
  __typename?: 'UserConnection';
  edges: Array<UserEdge>;
  pageInfo: PageInfo;
};

export type UserEdge = {
  __typename?: 'UserEdge';
  node: User;
};

export type UserFilters = {
  callingIsOneOf?: InputMaybe<Array<Scalars['ID']['input']>>;
  emailContains?: InputMaybe<Scalars['String']['input']>;
  firstNameContains?: InputMaybe<Scalars['String']['input']>;
  hasCalling?: InputMaybe<Scalars['Boolean']['input']>;
  isEmailVerified?: InputMaybe<Scalars['Boolean']['input']>;
  isSiteAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  lastNameContains?: InputMaybe<Scalars['String']['input']>;
};

export type UserSearch = {
  filters?: InputMaybe<UserFilters>;
  paging?: InputMaybe<OffsetPaging>;
  sorting?: InputMaybe<Array<UserSorting>>;
};

export type UserSortField =
  | 'EMAIL'
  | 'FIRST_NAME'
  | 'IS_EMAIL_VERIFIED'
  | 'IS_SITE_ADMIN'
  | 'LAST_NAME';

export type UserSorting = {
  direction: SortDirection;
  field: UserSortField;
};

export type VerifyEmailError = GenericError & {
  __typename?: 'VerifyEmailError';
  code?: Maybe<VerifyEmailErrorCodes>;
  message?: Maybe<Scalars['String']['output']>;
};

export type VerifyEmailErrorCodes =
  | 'CODE_EXPIRED'
  | 'CODE_INVALID'
  | 'DELETE_ERROR'
  | 'EMAIL_VERIFIER_AUTHENTICATION_FAILED'
  | 'NOT_FOUND'
  | 'UNKNOWN_ERROR';

export type VerifyEmailPayload = {
  __typename?: 'VerifyEmailPayload';
  error?: Maybe<VerifyEmailError>;
  success: Scalars['Boolean']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;


/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = {
  GenericError: ( Omit<AppointmentError, 'code'> & { code?: Maybe<_RefType['AppointmentErrorCodes']> } & { __typename: 'AppointmentError' } ) | ( Omit<LoginError, 'code'> & { code?: Maybe<_RefType['LoginErrorCodes']> } & { __typename: 'LoginError' } ) | ( Omit<RequestPasswordResetError, 'code'> & { code?: Maybe<_RefType['RequestPasswordResetErrorCodes']> } & { __typename: 'RequestPasswordResetError' } ) | ( Omit<ResendEmailVerificationError, 'code'> & { code?: Maybe<_RefType['ResendEmailVerificationErrorCodes']> } & { __typename: 'ResendEmailVerificationError' } ) | ( Omit<ResetPasswordError, 'code'> & { code?: Maybe<_RefType['ResetPasswordErrorCodes']> } & { __typename: 'ResetPasswordError' } ) | ( Omit<SignUpError, 'code'> & { code?: Maybe<_RefType['SignUpErrorCodes']> } & { __typename: 'SignUpError' } ) | ( Omit<TriviaGameError, 'code'> & { code?: Maybe<_RefType['TriviaGameErrorCodes']> } & { __typename: 'TriviaGameError' } ) | ( Omit<VerifyEmailError, 'code'> & { code?: Maybe<_RefType['VerifyEmailErrorCodes']> } & { __typename: 'VerifyEmailError' } );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AppointmentDetails: AppointmentDetails;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  AppointmentError: ResolverTypeWrapper<Omit<AppointmentError, 'code'> & { code?: Maybe<ResolversTypes['AppointmentErrorCodes']> }>;
  AppointmentErrorCodes: ResolverTypeWrapper<'APPOINTMENT_TYPE_NOT_FOUND' | 'APPOINTMENT_CONFLICT' | 'INVALID_TIME_SLOT' | 'UNKNOWN_ERROR'>;
  AppointmentPayload: ResolverTypeWrapper<Omit<AppointmentPayload, 'error'> & { error?: Maybe<ResolversTypes['AppointmentError']> }>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  AppointmentTimeSlot: AppointmentTimeSlot;
  AppointmentType: ResolverTypeWrapper<AppointmentType>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  AvailabilityBlock: ResolverTypeWrapper<AvailabilityBlockMapper>;
  Calling: ResolverTypeWrapper<CallingMapper>;
  CallingConnection: ResolverTypeWrapper<Omit<CallingConnection, 'edges'> & { edges: Array<ResolversTypes['CallingEdge']> }>;
  CallingEdge: ResolverTypeWrapper<Omit<CallingEdge, 'node'> & { node: ResolversTypes['Calling'] }>;
  CallingFilters: CallingFilters;
  CallingSearch: CallingSearch;
  Credentials: Credentials;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  EmailAddress: ResolverTypeWrapper<Scalars['EmailAddress']['output']>;
  GenericError: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['GenericError']>;
  LoginError: ResolverTypeWrapper<Omit<LoginError, 'code'> & { code?: Maybe<ResolversTypes['LoginErrorCodes']> }>;
  LoginErrorCodes: ResolverTypeWrapper<'USER_NOT_FOUND' | 'INVALID_CREDENTIALS' | 'UNKNOWN_ERROR'>;
  LoginPayload: ResolverTypeWrapper<Omit<LoginPayload, 'error' | 'user'> & { error?: Maybe<ResolversTypes['LoginError']>, user?: Maybe<ResolversTypes['User']> }>;
  LogoutPayload: ResolverTypeWrapper<LogoutPayload>;
  Mutation: ResolverTypeWrapper<{}>;
  OffsetPaging: OffsetPaging;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Permission: ResolverTypeWrapper<PermissionMapper>;
  PermissionConnection: ResolverTypeWrapper<Omit<PermissionConnection, 'edges'> & { edges: Array<ResolversTypes['PermissionEdge']> }>;
  PermissionEdge: ResolverTypeWrapper<Omit<PermissionEdge, 'node'> & { node: ResolversTypes['Permission'] }>;
  PermissionFilters: PermissionFilters;
  PermissionSearch: PermissionSearch;
  PlayerScore: ResolverTypeWrapper<PlayerScore>;
  PriorityDirection: ResolverTypeWrapper<'ASC' | 'DESC'>;
  Query: ResolverTypeWrapper<{}>;
  RequestPasswordResetError: ResolverTypeWrapper<Omit<RequestPasswordResetError, 'code'> & { code?: Maybe<ResolversTypes['RequestPasswordResetErrorCodes']> }>;
  RequestPasswordResetErrorCodes: ResolverTypeWrapper<'PASSWORD_RESET_AGENT_AUTHENTICATION_FAILED' | 'NOT_FOUND' | 'COULD_NOT_UPDATE' | 'COULD_NOT_CREATE' | 'EMAIL_ERROR' | 'UNKNOWN_ERROR'>;
  RequestPasswordResetPayload: ResolverTypeWrapper<Omit<RequestPasswordResetPayload, 'error'> & { error?: Maybe<ResolversTypes['RequestPasswordResetError']> }>;
  ResendEmailVerificationError: ResolverTypeWrapper<Omit<ResendEmailVerificationError, 'code'> & { code?: Maybe<ResolversTypes['ResendEmailVerificationErrorCodes']> }>;
  ResendEmailVerificationErrorCodes: ResolverTypeWrapper<'EMAIL_VERIFIER_AUTHENTICATION_FAILED' | 'NOT_FOUND' | 'EMAIL_ALREADY_VERIFIED' | 'COULD_NOT_UPDATE' | 'COULD_NOT_CREATE' | 'EMAIL_ERROR' | 'UNKNOWN_ERROR'>;
  ResendEmailVerificationPayload: ResolverTypeWrapper<Omit<ResendEmailVerificationPayload, 'error'> & { error?: Maybe<ResolversTypes['ResendEmailVerificationError']> }>;
  ResetPasswordDetails: ResetPasswordDetails;
  ResetPasswordError: ResolverTypeWrapper<Omit<ResetPasswordError, 'code'> & { code?: Maybe<ResolversTypes['ResetPasswordErrorCodes']> }>;
  ResetPasswordErrorCodes: ResolverTypeWrapper<'PASSWORD_RESET_AGENT_AUTHENTICATION_FAILED' | 'NOT_FOUND' | 'CODE_EXPIRED' | 'CODE_INVALID' | 'RESET_ERROR' | 'DELETE_ERROR' | 'UNKNOWN_ERROR'>;
  ResetPasswordPayload: ResolverTypeWrapper<Omit<ResetPasswordPayload, 'error'> & { error?: Maybe<ResolversTypes['ResetPasswordError']> }>;
  SignUpDetails: SignUpDetails;
  SignUpError: ResolverTypeWrapper<Omit<SignUpError, 'code'> & { code?: Maybe<ResolversTypes['SignUpErrorCodes']> }>;
  SignUpErrorCodes: ResolverTypeWrapper<'INVALID_PASSWORD_LENGTH' | 'MISSING_CAPITAL_LETTER' | 'MISSING_LOWERCASE_LETTER' | 'MISSING_NUMBER' | 'INVALID_PASSWORD_CHARACTER' | 'INVALID_CREDENTIALS' | 'EMAIL_VERIFIER_AUTHENTICATION_FAILED' | 'NOT_FOUND' | 'EMAIL_ERROR' | 'UNKNOWN_ERROR'>;
  SignUpPayload: ResolverTypeWrapper<Omit<SignUpPayload, 'error'> & { error?: Maybe<ResolversTypes['SignUpError']> }>;
  SortDirection: ResolverTypeWrapper<'ASC' | 'DESC'>;
  Subscription: ResolverTypeWrapper<{}>;
  TimeSlot: ResolverTypeWrapper<TimeSlot>;
  TriviaAnswer: ResolverTypeWrapper<'A' | 'B' | 'C' | 'D'>;
  TriviaGame: ResolverTypeWrapper<TriviaGame>;
  TriviaGameError: ResolverTypeWrapper<Omit<TriviaGameError, 'code'> & { code?: Maybe<ResolversTypes['TriviaGameErrorCodes']> }>;
  TriviaGameErrorCodes: ResolverTypeWrapper<'GAME_NOT_FOUND' | 'GAME_ALREADY_EXISTS' | 'INSUFFICIENT_PERMISSIONS' | 'UNKNOWN_ERROR'>;
  TriviaGamePayload: ResolverTypeWrapper<Omit<TriviaGamePayload, 'error'> & { error?: Maybe<ResolversTypes['TriviaGameError']> }>;
  TriviaGameScore: ResolverTypeWrapper<TriviaGameScore>;
  TriviaGameState: ResolverTypeWrapper<'SPLASH' | 'QUESTION' | 'ANSWER' | 'SCORE' | 'PAUSED' | 'STOPPED' | 'CLOSED'>;
  TriviaGameUpdateForAdmin: ResolverTypeWrapper<Omit<TriviaGameUpdateForAdmin, 'question' | 'state'> & { question?: Maybe<ResolversTypes['TriviaQuestion']>, state: ResolversTypes['TriviaGameState'] }>;
  TriviaGameUpdateForBoard: ResolverTypeWrapper<Omit<TriviaGameUpdateForBoard, 'question' | 'state'> & { question?: Maybe<ResolversTypes['TriviaQuestion']>, state: ResolversTypes['TriviaGameState'] }>;
  TriviaGameUpdateForPlayer: ResolverTypeWrapper<Omit<TriviaGameUpdateForPlayer, 'question' | 'state'> & { question?: Maybe<ResolversTypes['TriviaQuestion']>, state: ResolversTypes['TriviaGameState'] }>;
  TriviaOption: ResolverTypeWrapper<Omit<TriviaOption, 'option'> & { option: ResolversTypes['TriviaAnswer'] }>;
  TriviaPlayerScore: ResolverTypeWrapper<TriviaPlayerScore>;
  TriviaQuestion: ResolverTypeWrapper<Omit<TriviaQuestion, 'correctAnswer' | 'options'> & { correctAnswer?: Maybe<ResolversTypes['TriviaAnswer']>, options: Array<ResolversTypes['TriviaOption']> }>;
  User: ResolverTypeWrapper<UserMapper>;
  UserConnection: ResolverTypeWrapper<Omit<UserConnection, 'edges'> & { edges: Array<ResolversTypes['UserEdge']> }>;
  UserEdge: ResolverTypeWrapper<Omit<UserEdge, 'node'> & { node: ResolversTypes['User'] }>;
  UserFilters: UserFilters;
  UserSearch: UserSearch;
  UserSortField: ResolverTypeWrapper<'EMAIL' | 'FIRST_NAME' | 'LAST_NAME' | 'IS_EMAIL_VERIFIED' | 'IS_SITE_ADMIN'>;
  UserSorting: UserSorting;
  VerifyEmailError: ResolverTypeWrapper<Omit<VerifyEmailError, 'code'> & { code?: Maybe<ResolversTypes['VerifyEmailErrorCodes']> }>;
  VerifyEmailErrorCodes: ResolverTypeWrapper<'EMAIL_VERIFIER_AUTHENTICATION_FAILED' | 'NOT_FOUND' | 'CODE_EXPIRED' | 'CODE_INVALID' | 'DELETE_ERROR' | 'UNKNOWN_ERROR'>;
  VerifyEmailPayload: ResolverTypeWrapper<Omit<VerifyEmailPayload, 'error'> & { error?: Maybe<ResolversTypes['VerifyEmailError']> }>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AppointmentDetails: AppointmentDetails;
  ID: Scalars['ID']['output'];
  String: Scalars['String']['output'];
  AppointmentError: AppointmentError;
  AppointmentPayload: Omit<AppointmentPayload, 'error'> & { error?: Maybe<ResolversParentTypes['AppointmentError']> };
  Boolean: Scalars['Boolean']['output'];
  AppointmentTimeSlot: AppointmentTimeSlot;
  AppointmentType: AppointmentType;
  Int: Scalars['Int']['output'];
  AvailabilityBlock: AvailabilityBlockMapper;
  Calling: CallingMapper;
  CallingConnection: Omit<CallingConnection, 'edges'> & { edges: Array<ResolversParentTypes['CallingEdge']> };
  CallingEdge: Omit<CallingEdge, 'node'> & { node: ResolversParentTypes['Calling'] };
  CallingFilters: CallingFilters;
  CallingSearch: CallingSearch;
  Credentials: Credentials;
  DateTime: Scalars['DateTime']['output'];
  EmailAddress: Scalars['EmailAddress']['output'];
  GenericError: ResolversInterfaceTypes<ResolversParentTypes>['GenericError'];
  LoginError: LoginError;
  LoginPayload: Omit<LoginPayload, 'error' | 'user'> & { error?: Maybe<ResolversParentTypes['LoginError']>, user?: Maybe<ResolversParentTypes['User']> };
  LogoutPayload: LogoutPayload;
  Mutation: {};
  OffsetPaging: OffsetPaging;
  PageInfo: PageInfo;
  Permission: PermissionMapper;
  PermissionConnection: Omit<PermissionConnection, 'edges'> & { edges: Array<ResolversParentTypes['PermissionEdge']> };
  PermissionEdge: Omit<PermissionEdge, 'node'> & { node: ResolversParentTypes['Permission'] };
  PermissionFilters: PermissionFilters;
  PermissionSearch: PermissionSearch;
  PlayerScore: PlayerScore;
  Query: {};
  RequestPasswordResetError: RequestPasswordResetError;
  RequestPasswordResetPayload: Omit<RequestPasswordResetPayload, 'error'> & { error?: Maybe<ResolversParentTypes['RequestPasswordResetError']> };
  ResendEmailVerificationError: ResendEmailVerificationError;
  ResendEmailVerificationPayload: Omit<ResendEmailVerificationPayload, 'error'> & { error?: Maybe<ResolversParentTypes['ResendEmailVerificationError']> };
  ResetPasswordDetails: ResetPasswordDetails;
  ResetPasswordError: ResetPasswordError;
  ResetPasswordPayload: Omit<ResetPasswordPayload, 'error'> & { error?: Maybe<ResolversParentTypes['ResetPasswordError']> };
  SignUpDetails: SignUpDetails;
  SignUpError: SignUpError;
  SignUpPayload: Omit<SignUpPayload, 'error'> & { error?: Maybe<ResolversParentTypes['SignUpError']> };
  Subscription: {};
  TimeSlot: TimeSlot;
  TriviaGame: TriviaGame;
  TriviaGameError: TriviaGameError;
  TriviaGamePayload: Omit<TriviaGamePayload, 'error'> & { error?: Maybe<ResolversParentTypes['TriviaGameError']> };
  TriviaGameScore: TriviaGameScore;
  TriviaGameUpdateForAdmin: Omit<TriviaGameUpdateForAdmin, 'question'> & { question?: Maybe<ResolversParentTypes['TriviaQuestion']> };
  TriviaGameUpdateForBoard: Omit<TriviaGameUpdateForBoard, 'question'> & { question?: Maybe<ResolversParentTypes['TriviaQuestion']> };
  TriviaGameUpdateForPlayer: Omit<TriviaGameUpdateForPlayer, 'question'> & { question?: Maybe<ResolversParentTypes['TriviaQuestion']> };
  TriviaOption: TriviaOption;
  TriviaPlayerScore: TriviaPlayerScore;
  TriviaQuestion: Omit<TriviaQuestion, 'options'> & { options: Array<ResolversParentTypes['TriviaOption']> };
  User: UserMapper;
  UserConnection: Omit<UserConnection, 'edges'> & { edges: Array<ResolversParentTypes['UserEdge']> };
  UserEdge: Omit<UserEdge, 'node'> & { node: ResolversParentTypes['User'] };
  UserFilters: UserFilters;
  UserSearch: UserSearch;
  UserSorting: UserSorting;
  VerifyEmailError: VerifyEmailError;
  VerifyEmailPayload: Omit<VerifyEmailPayload, 'error'> & { error?: Maybe<ResolversParentTypes['VerifyEmailError']> };
};

export type AppointmentErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppointmentError'] = ResolversParentTypes['AppointmentError']> = {
  code?: Resolver<Maybe<ResolversTypes['AppointmentErrorCodes']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppointmentErrorCodesResolvers = EnumResolverSignature<{ APPOINTMENT_CONFLICT?: any, APPOINTMENT_TYPE_NOT_FOUND?: any, INVALID_TIME_SLOT?: any, UNKNOWN_ERROR?: any }, ResolversTypes['AppointmentErrorCodes']>;

export type AppointmentPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppointmentPayload'] = ResolversParentTypes['AppointmentPayload']> = {
  bishopricMember?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['AppointmentError']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  timeSlot?: Resolver<Maybe<ResolversTypes['TimeSlot']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppointmentTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppointmentType'] = ResolversParentTypes['AppointmentType']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  durationInMinutes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  interviewers?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AvailabilityBlockResolvers<ContextType = any, ParentType extends ResolversParentTypes['AvailabilityBlock'] = ResolversParentTypes['AvailabilityBlock']> = {
  availableSlot?: Resolver<Maybe<ResolversTypes['TimeSlot']>, ParentType, ContextType, RequireFields<AvailabilityBlockavailableSlotArgs, 'durationInMinutes'>>;
  bishopricMember?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  end?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  priorityDirection?: Resolver<Maybe<ResolversTypes['PriorityDirection']>, ParentType, ContextType>;
  start?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CallingResolvers<ContextType = any, ParentType extends ResolversParentTypes['Calling'] = ResolversParentTypes['Calling']> = {
  assignedTo?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  permissions?: Resolver<Array<ResolversTypes['Permission']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CallingConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['CallingConnection'] = ResolversParentTypes['CallingConnection']> = {
  edges?: Resolver<Array<ResolversTypes['CallingEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CallingEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['CallingEdge'] = ResolversParentTypes['CallingEdge']> = {
  node?: Resolver<ResolversTypes['Calling'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface EmailAddressScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['EmailAddress'], any> {
  name: 'EmailAddress';
}

export type GenericErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['GenericError'] = ResolversParentTypes['GenericError']> = {
  __resolveType?: TypeResolveFn<'AppointmentError' | 'LoginError' | 'RequestPasswordResetError' | 'ResendEmailVerificationError' | 'ResetPasswordError' | 'SignUpError' | 'TriviaGameError' | 'VerifyEmailError', ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type LoginErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginError'] = ResolversParentTypes['LoginError']> = {
  code?: Resolver<Maybe<ResolversTypes['LoginErrorCodes']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LoginErrorCodesResolvers = EnumResolverSignature<{ INVALID_CREDENTIALS?: any, UNKNOWN_ERROR?: any, USER_NOT_FOUND?: any }, ResolversTypes['LoginErrorCodes']>;

export type LoginPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginPayload'] = ResolversParentTypes['LoginPayload']> = {
  error?: Resolver<Maybe<ResolversTypes['LoginError']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LogoutPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['LogoutPayload'] = ResolversParentTypes['LogoutPayload']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  changeMyTriviaPlayerName?: Resolver<ResolversTypes['TriviaGamePayload'], ParentType, ContextType, RequireFields<MutationchangeMyTriviaPlayerNameArgs, 'newName'>>;
  closeTriviaGame?: Resolver<ResolversTypes['TriviaGamePayload'], ParentType, ContextType>;
  createAppointment?: Resolver<ResolversTypes['AppointmentPayload'], ParentType, ContextType, RequireFields<MutationcreateAppointmentArgs, 'input'>>;
  createTriviaGame?: Resolver<ResolversTypes['TriviaGamePayload'], ParentType, ContextType, RequireFields<MutationcreateTriviaGameArgs, 'gameId'>>;
  login?: Resolver<ResolversTypes['LoginPayload'], ParentType, ContextType, RequireFields<MutationloginArgs, 'input'>>;
  logout?: Resolver<ResolversTypes['LogoutPayload'], ParentType, ContextType>;
  nextTriviaQuestion?: Resolver<ResolversTypes['TriviaGamePayload'], ParentType, ContextType>;
  pauseTriviaGame?: Resolver<ResolversTypes['TriviaGamePayload'], ParentType, ContextType>;
  requestPasswordReset?: Resolver<ResolversTypes['RequestPasswordResetPayload'], ParentType, ContextType, RequireFields<MutationrequestPasswordResetArgs, 'email'>>;
  resendEmailVerification?: Resolver<ResolversTypes['ResendEmailVerificationPayload'], ParentType, ContextType, RequireFields<MutationresendEmailVerificationArgs, 'email'>>;
  resetPassword?: Resolver<ResolversTypes['ResetPasswordPayload'], ParentType, ContextType, RequireFields<MutationresetPasswordArgs, 'input'>>;
  resumeTriviaGame?: Resolver<ResolversTypes['TriviaGamePayload'], ParentType, ContextType>;
  showScoreAfterQuestion?: Resolver<ResolversTypes['TriviaGamePayload'], ParentType, ContextType>;
  showScoreImmediately?: Resolver<ResolversTypes['TriviaGamePayload'], ParentType, ContextType>;
  signUp?: Resolver<ResolversTypes['SignUpPayload'], ParentType, ContextType, RequireFields<MutationsignUpArgs, 'input'>>;
  startTriviaGame?: Resolver<ResolversTypes['TriviaGamePayload'], ParentType, ContextType, RequireFields<MutationstartTriviaGameArgs, 'gameId'>>;
  stopTriviaGame?: Resolver<ResolversTypes['TriviaGamePayload'], ParentType, ContextType>;
  submitTriviaAnswer?: Resolver<ResolversTypes['TriviaGamePayload'], ParentType, ContextType, RequireFields<MutationsubmitTriviaAnswerArgs, 'answer'>>;
  verifyEmail?: Resolver<ResolversTypes['VerifyEmailPayload'], ParentType, ContextType, RequireFields<MutationverifyEmailArgs, 'code' | 'email'>>;
};

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  pageOffset?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageSize?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PermissionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Permission'] = ResolversParentTypes['Permission']> = {
  callings?: Resolver<Array<ResolversTypes['Calling']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PermissionConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['PermissionConnection'] = ResolversParentTypes['PermissionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['PermissionEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PermissionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['PermissionEdge'] = ResolversParentTypes['PermissionEdge']> = {
  node?: Resolver<ResolversTypes['Permission'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlayerScoreResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlayerScore'] = ResolversParentTypes['PlayerScore']> = {
  playerName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PriorityDirectionResolvers = EnumResolverSignature<{ ASC?: any, DESC?: any }, ResolversTypes['PriorityDirection']>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  allAppointmentTypes?: Resolver<Array<ResolversTypes['AppointmentType']>, ParentType, ContextType>;
  allAvailabilityBlocks?: Resolver<Array<ResolversTypes['AvailabilityBlock']>, ParentType, ContextType>;
  availabilityBlocks?: Resolver<Array<ResolversTypes['AvailabilityBlock']>, ParentType, ContextType, RequireFields<QueryavailabilityBlocksArgs, 'bishopricMember'>>;
  availableTimeSlots?: Resolver<Array<Maybe<ResolversTypes['TimeSlot']>>, ParentType, ContextType, RequireFields<QueryavailableTimeSlotsArgs, 'bishopricMember' | 'durationInMinutes'>>;
  callings?: Resolver<Maybe<ResolversTypes['CallingConnection']>, ParentType, ContextType, Partial<QuerycallingsArgs>>;
  currentGame?: Resolver<Maybe<ResolversTypes['TriviaGame']>, ParentType, ContextType>;
  myTriviaScore?: Resolver<Array<ResolversTypes['TriviaPlayerScore']>, ParentType, ContextType>;
  permissions?: Resolver<Maybe<ResolversTypes['PermissionConnection']>, ParentType, ContextType, Partial<QuerypermissionsArgs>>;
  self?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  users?: Resolver<Maybe<ResolversTypes['UserConnection']>, ParentType, ContextType, Partial<QueryusersArgs>>;
};

export type RequestPasswordResetErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['RequestPasswordResetError'] = ResolversParentTypes['RequestPasswordResetError']> = {
  code?: Resolver<Maybe<ResolversTypes['RequestPasswordResetErrorCodes']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RequestPasswordResetErrorCodesResolvers = EnumResolverSignature<{ COULD_NOT_CREATE?: any, COULD_NOT_UPDATE?: any, EMAIL_ERROR?: any, NOT_FOUND?: any, PASSWORD_RESET_AGENT_AUTHENTICATION_FAILED?: any, UNKNOWN_ERROR?: any }, ResolversTypes['RequestPasswordResetErrorCodes']>;

export type RequestPasswordResetPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['RequestPasswordResetPayload'] = ResolversParentTypes['RequestPasswordResetPayload']> = {
  error?: Resolver<Maybe<ResolversTypes['RequestPasswordResetError']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResendEmailVerificationErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResendEmailVerificationError'] = ResolversParentTypes['ResendEmailVerificationError']> = {
  code?: Resolver<Maybe<ResolversTypes['ResendEmailVerificationErrorCodes']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResendEmailVerificationErrorCodesResolvers = EnumResolverSignature<{ COULD_NOT_CREATE?: any, COULD_NOT_UPDATE?: any, EMAIL_ALREADY_VERIFIED?: any, EMAIL_ERROR?: any, EMAIL_VERIFIER_AUTHENTICATION_FAILED?: any, NOT_FOUND?: any, UNKNOWN_ERROR?: any }, ResolversTypes['ResendEmailVerificationErrorCodes']>;

export type ResendEmailVerificationPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResendEmailVerificationPayload'] = ResolversParentTypes['ResendEmailVerificationPayload']> = {
  error?: Resolver<Maybe<ResolversTypes['ResendEmailVerificationError']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResetPasswordErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResetPasswordError'] = ResolversParentTypes['ResetPasswordError']> = {
  code?: Resolver<Maybe<ResolversTypes['ResetPasswordErrorCodes']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResetPasswordErrorCodesResolvers = EnumResolverSignature<{ CODE_EXPIRED?: any, CODE_INVALID?: any, DELETE_ERROR?: any, NOT_FOUND?: any, PASSWORD_RESET_AGENT_AUTHENTICATION_FAILED?: any, RESET_ERROR?: any, UNKNOWN_ERROR?: any }, ResolversTypes['ResetPasswordErrorCodes']>;

export type ResetPasswordPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResetPasswordPayload'] = ResolversParentTypes['ResetPasswordPayload']> = {
  error?: Resolver<Maybe<ResolversTypes['ResetPasswordError']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SignUpErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['SignUpError'] = ResolversParentTypes['SignUpError']> = {
  code?: Resolver<Maybe<ResolversTypes['SignUpErrorCodes']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SignUpErrorCodesResolvers = EnumResolverSignature<{ EMAIL_ERROR?: any, EMAIL_VERIFIER_AUTHENTICATION_FAILED?: any, INVALID_CREDENTIALS?: any, INVALID_PASSWORD_CHARACTER?: any, INVALID_PASSWORD_LENGTH?: any, MISSING_CAPITAL_LETTER?: any, MISSING_LOWERCASE_LETTER?: any, MISSING_NUMBER?: any, NOT_FOUND?: any, UNKNOWN_ERROR?: any }, ResolversTypes['SignUpErrorCodes']>;

export type SignUpPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['SignUpPayload'] = ResolversParentTypes['SignUpPayload']> = {
  error?: Resolver<Maybe<ResolversTypes['SignUpError']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SortDirectionResolvers = EnumResolverSignature<{ ASC?: any, DESC?: any }, ResolversTypes['SortDirection']>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  joinTriviaGameAsAdmin?: SubscriptionResolver<ResolversTypes['TriviaGameUpdateForAdmin'], "joinTriviaGameAsAdmin", ParentType, ContextType>;
  joinTriviaGameAsBoard?: SubscriptionResolver<ResolversTypes['TriviaGameUpdateForBoard'], "joinTriviaGameAsBoard", ParentType, ContextType>;
  joinTriviaGameAsPlayer?: SubscriptionResolver<ResolversTypes['TriviaGameUpdateForPlayer'], "joinTriviaGameAsPlayer", ParentType, ContextType>;
};

export type TimeSlotResolvers<ContextType = any, ParentType extends ResolversParentTypes['TimeSlot'] = ResolversParentTypes['TimeSlot']> = {
  end?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  start?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TriviaAnswerResolvers = EnumResolverSignature<{ A?: any, B?: any, C?: any, D?: any }, ResolversTypes['TriviaAnswer']>;

export type TriviaGameResolvers<ContextType = any, ParentType extends ResolversParentTypes['TriviaGame'] = ResolversParentTypes['TriviaGame']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TriviaGameErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['TriviaGameError'] = ResolversParentTypes['TriviaGameError']> = {
  code?: Resolver<Maybe<ResolversTypes['TriviaGameErrorCodes']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TriviaGameErrorCodesResolvers = EnumResolverSignature<{ GAME_ALREADY_EXISTS?: any, GAME_NOT_FOUND?: any, INSUFFICIENT_PERMISSIONS?: any, UNKNOWN_ERROR?: any }, ResolversTypes['TriviaGameErrorCodes']>;

export type TriviaGamePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['TriviaGamePayload'] = ResolversParentTypes['TriviaGamePayload']> = {
  error?: Resolver<Maybe<ResolversTypes['TriviaGameError']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TriviaGameScoreResolvers<ContextType = any, ParentType extends ResolversParentTypes['TriviaGameScore'] = ResolversParentTypes['TriviaGameScore']> = {
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  scores?: Resolver<Array<ResolversTypes['PlayerScore']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TriviaGameStateResolvers = EnumResolverSignature<{ ANSWER?: any, CLOSED?: any, PAUSED?: any, QUESTION?: any, SCORE?: any, SPLASH?: any, STOPPED?: any }, ResolversTypes['TriviaGameState']>;

export type TriviaGameUpdateForAdminResolvers<ContextType = any, ParentType extends ResolversParentTypes['TriviaGameUpdateForAdmin'] = ResolversParentTypes['TriviaGameUpdateForAdmin']> = {
  question?: Resolver<Maybe<ResolversTypes['TriviaQuestion']>, ParentType, ContextType>;
  state?: Resolver<ResolversTypes['TriviaGameState'], ParentType, ContextType>;
  time?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TriviaGameUpdateForBoardResolvers<ContextType = any, ParentType extends ResolversParentTypes['TriviaGameUpdateForBoard'] = ResolversParentTypes['TriviaGameUpdateForBoard']> = {
  question?: Resolver<Maybe<ResolversTypes['TriviaQuestion']>, ParentType, ContextType>;
  scores?: Resolver<Maybe<Array<ResolversTypes['TriviaGameScore']>>, ParentType, ContextType>;
  state?: Resolver<ResolversTypes['TriviaGameState'], ParentType, ContextType>;
  time?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TriviaGameUpdateForPlayerResolvers<ContextType = any, ParentType extends ResolversParentTypes['TriviaGameUpdateForPlayer'] = ResolversParentTypes['TriviaGameUpdateForPlayer']> = {
  question?: Resolver<Maybe<ResolversTypes['TriviaQuestion']>, ParentType, ContextType>;
  state?: Resolver<ResolversTypes['TriviaGameState'], ParentType, ContextType>;
  time?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TriviaOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['TriviaOption'] = ResolversParentTypes['TriviaOption']> = {
  option?: Resolver<ResolversTypes['TriviaAnswer'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TriviaPlayerScoreResolvers<ContextType = any, ParentType extends ResolversParentTypes['TriviaPlayerScore'] = ResolversParentTypes['TriviaPlayerScore']> = {
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TriviaQuestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['TriviaQuestion'] = ResolversParentTypes['TriviaQuestion']> = {
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  correctAnswer?: Resolver<Maybe<ResolversTypes['TriviaAnswer']>, ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['TriviaOption']>, ParentType, ContextType>;
  question?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  callings?: Resolver<Array<ResolversTypes['Calling']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['EmailAddress'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isSiteAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserConnection'] = ResolversParentTypes['UserConnection']> = {
  edges?: Resolver<Array<ResolversTypes['UserEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserEdge'] = ResolversParentTypes['UserEdge']> = {
  node?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSortFieldResolvers = EnumResolverSignature<{ EMAIL?: any, FIRST_NAME?: any, IS_EMAIL_VERIFIED?: any, IS_SITE_ADMIN?: any, LAST_NAME?: any }, ResolversTypes['UserSortField']>;

export type VerifyEmailErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['VerifyEmailError'] = ResolversParentTypes['VerifyEmailError']> = {
  code?: Resolver<Maybe<ResolversTypes['VerifyEmailErrorCodes']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VerifyEmailErrorCodesResolvers = EnumResolverSignature<{ CODE_EXPIRED?: any, CODE_INVALID?: any, DELETE_ERROR?: any, EMAIL_VERIFIER_AUTHENTICATION_FAILED?: any, NOT_FOUND?: any, UNKNOWN_ERROR?: any }, ResolversTypes['VerifyEmailErrorCodes']>;

export type VerifyEmailPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['VerifyEmailPayload'] = ResolversParentTypes['VerifyEmailPayload']> = {
  error?: Resolver<Maybe<ResolversTypes['VerifyEmailError']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AppointmentError?: AppointmentErrorResolvers<ContextType>;
  AppointmentErrorCodes?: AppointmentErrorCodesResolvers;
  AppointmentPayload?: AppointmentPayloadResolvers<ContextType>;
  AppointmentType?: AppointmentTypeResolvers<ContextType>;
  AvailabilityBlock?: AvailabilityBlockResolvers<ContextType>;
  Calling?: CallingResolvers<ContextType>;
  CallingConnection?: CallingConnectionResolvers<ContextType>;
  CallingEdge?: CallingEdgeResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  EmailAddress?: GraphQLScalarType;
  GenericError?: GenericErrorResolvers<ContextType>;
  LoginError?: LoginErrorResolvers<ContextType>;
  LoginErrorCodes?: LoginErrorCodesResolvers;
  LoginPayload?: LoginPayloadResolvers<ContextType>;
  LogoutPayload?: LogoutPayloadResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Permission?: PermissionResolvers<ContextType>;
  PermissionConnection?: PermissionConnectionResolvers<ContextType>;
  PermissionEdge?: PermissionEdgeResolvers<ContextType>;
  PlayerScore?: PlayerScoreResolvers<ContextType>;
  PriorityDirection?: PriorityDirectionResolvers;
  Query?: QueryResolvers<ContextType>;
  RequestPasswordResetError?: RequestPasswordResetErrorResolvers<ContextType>;
  RequestPasswordResetErrorCodes?: RequestPasswordResetErrorCodesResolvers;
  RequestPasswordResetPayload?: RequestPasswordResetPayloadResolvers<ContextType>;
  ResendEmailVerificationError?: ResendEmailVerificationErrorResolvers<ContextType>;
  ResendEmailVerificationErrorCodes?: ResendEmailVerificationErrorCodesResolvers;
  ResendEmailVerificationPayload?: ResendEmailVerificationPayloadResolvers<ContextType>;
  ResetPasswordError?: ResetPasswordErrorResolvers<ContextType>;
  ResetPasswordErrorCodes?: ResetPasswordErrorCodesResolvers;
  ResetPasswordPayload?: ResetPasswordPayloadResolvers<ContextType>;
  SignUpError?: SignUpErrorResolvers<ContextType>;
  SignUpErrorCodes?: SignUpErrorCodesResolvers;
  SignUpPayload?: SignUpPayloadResolvers<ContextType>;
  SortDirection?: SortDirectionResolvers;
  Subscription?: SubscriptionResolvers<ContextType>;
  TimeSlot?: TimeSlotResolvers<ContextType>;
  TriviaAnswer?: TriviaAnswerResolvers;
  TriviaGame?: TriviaGameResolvers<ContextType>;
  TriviaGameError?: TriviaGameErrorResolvers<ContextType>;
  TriviaGameErrorCodes?: TriviaGameErrorCodesResolvers;
  TriviaGamePayload?: TriviaGamePayloadResolvers<ContextType>;
  TriviaGameScore?: TriviaGameScoreResolvers<ContextType>;
  TriviaGameState?: TriviaGameStateResolvers;
  TriviaGameUpdateForAdmin?: TriviaGameUpdateForAdminResolvers<ContextType>;
  TriviaGameUpdateForBoard?: TriviaGameUpdateForBoardResolvers<ContextType>;
  TriviaGameUpdateForPlayer?: TriviaGameUpdateForPlayerResolvers<ContextType>;
  TriviaOption?: TriviaOptionResolvers<ContextType>;
  TriviaPlayerScore?: TriviaPlayerScoreResolvers<ContextType>;
  TriviaQuestion?: TriviaQuestionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserConnection?: UserConnectionResolvers<ContextType>;
  UserEdge?: UserEdgeResolvers<ContextType>;
  UserSortField?: UserSortFieldResolvers;
  VerifyEmailError?: VerifyEmailErrorResolvers<ContextType>;
  VerifyEmailErrorCodes?: VerifyEmailErrorCodesResolvers;
  VerifyEmailPayload?: VerifyEmailPayloadResolvers<ContextType>;
};

