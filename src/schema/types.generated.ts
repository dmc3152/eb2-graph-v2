import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { AvailabilityBlockMapper } from './calendarEvent/schema.mappers';
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
};

export type AppointmentCode =
  | 'BAPTISM'
  | 'ECCLESIASTICAL_ENDORSEMENT'
  | 'MISSION'
  | 'OTHER'
  | 'PATRIARCHAL_BLESSING'
  | 'PERSONAL_MATTER_LONG'
  | 'PERSONAL_MATTER_SHORT'
  | 'TEMPLE_RECOMMEND'
  | 'TEMPLE_RECOMMEND_RENEWAL'
  | 'TEMPLE_WORKER'
  | 'TITHING_DECLARATION';

export type AppointmentDetails = {
  bishopricMember: BishopricMember;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  timeSlot: AppointmentTimeSlot;
  type: AppointmentCode;
};

export type AppointmentError = GenericError & {
  __typename?: 'AppointmentError';
  code?: Maybe<AppointmentErrorCodes>;
  message?: Maybe<Scalars['String']['output']>;
};

export type AppointmentErrorCodes =
  | 'APPOINTMENT_CONFLICT'
  | 'INVALID_TIME_SLOT'
  | 'UNKNOWN_ERROR';

export type AppointmentPayload = {
  __typename?: 'AppointmentPayload';
  bishopricMember?: Maybe<BishopricMember>;
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
  code: AppointmentCode;
  description?: Maybe<Scalars['String']['output']>;
  durationInMinutes: Scalars['Int']['output'];
  interviewers: Array<BishopricMember>;
  name: Scalars['String']['output'];
};

export type AvailabilityBlock = {
  __typename?: 'AvailabilityBlock';
  availableSlot?: Maybe<TimeSlot>;
  bishopricMember?: Maybe<BishopricMember>;
  end?: Maybe<Scalars['DateTime']['output']>;
  priorityDirection?: Maybe<PriorityDirection>;
  start?: Maybe<Scalars['DateTime']['output']>;
};


export type AvailabilityBlockavailableSlotArgs = {
  durationInMinutes: Scalars['Int']['input'];
};

export type BishopricMember =
  | 'BISHOP'
  | 'FIRST_COUNSELOR'
  | 'SECOND_COUNSELOR';

export type GenericError = {
  message?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAppointment: AppointmentPayload;
};


export type MutationcreateAppointmentArgs = {
  input: AppointmentDetails;
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
  user?: Maybe<User>;
};


export type QueryavailabilityBlocksArgs = {
  bishopricMember: BishopricMember;
};


export type QueryavailableTimeSlotsArgs = {
  bishopricMember: BishopricMember;
  durationInMinutes: Scalars['Int']['input'];
};


export type QueryuserArgs = {
  id: Scalars['ID']['input'];
};

export type TimeSlot = {
  __typename?: 'TimeSlot';
  end?: Maybe<Scalars['DateTime']['output']>;
  start?: Maybe<Scalars['DateTime']['output']>;
};

export type User = {
  __typename?: 'User';
  fullName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isAdmin: Scalars['Boolean']['output'];
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
  GenericError: ( Omit<AppointmentError, 'code'> & { code?: Maybe<_RefType['AppointmentErrorCodes']> } & { __typename: 'AppointmentError' } );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AppointmentCode: ResolverTypeWrapper<'BAPTISM' | 'ECCLESIASTICAL_ENDORSEMENT' | 'MISSION' | 'OTHER' | 'PATRIARCHAL_BLESSING' | 'PERSONAL_MATTER_LONG' | 'PERSONAL_MATTER_SHORT' | 'TEMPLE_RECOMMEND' | 'TEMPLE_RECOMMEND_RENEWAL' | 'TEMPLE_WORKER' | 'TITHING_DECLARATION'>;
  AppointmentDetails: AppointmentDetails;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  AppointmentError: ResolverTypeWrapper<Omit<AppointmentError, 'code'> & { code?: Maybe<ResolversTypes['AppointmentErrorCodes']> }>;
  AppointmentErrorCodes: ResolverTypeWrapper<'APPOINTMENT_CONFLICT' | 'INVALID_TIME_SLOT' | 'UNKNOWN_ERROR'>;
  AppointmentPayload: ResolverTypeWrapper<Omit<AppointmentPayload, 'bishopricMember' | 'error'> & { bishopricMember?: Maybe<ResolversTypes['BishopricMember']>, error?: Maybe<ResolversTypes['AppointmentError']> }>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  AppointmentTimeSlot: AppointmentTimeSlot;
  AppointmentType: ResolverTypeWrapper<Omit<AppointmentType, 'code' | 'interviewers'> & { code: ResolversTypes['AppointmentCode'], interviewers: Array<ResolversTypes['BishopricMember']> }>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  AvailabilityBlock: ResolverTypeWrapper<AvailabilityBlockMapper>;
  BishopricMember: ResolverTypeWrapper<'BISHOP' | 'FIRST_COUNSELOR' | 'SECOND_COUNSELOR'>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  GenericError: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['GenericError']>;
  Mutation: ResolverTypeWrapper<{}>;
  PriorityDirection: ResolverTypeWrapper<'ASC' | 'DESC'>;
  Query: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  TimeSlot: ResolverTypeWrapper<TimeSlot>;
  User: ResolverTypeWrapper<UserMapper>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AppointmentDetails: AppointmentDetails;
  String: Scalars['String']['output'];
  AppointmentError: AppointmentError;
  AppointmentPayload: Omit<AppointmentPayload, 'error'> & { error?: Maybe<ResolversParentTypes['AppointmentError']> };
  Boolean: Scalars['Boolean']['output'];
  AppointmentTimeSlot: AppointmentTimeSlot;
  AppointmentType: AppointmentType;
  Int: Scalars['Int']['output'];
  AvailabilityBlock: AvailabilityBlockMapper;
  DateTime: Scalars['DateTime']['output'];
  GenericError: ResolversInterfaceTypes<ResolversParentTypes>['GenericError'];
  Mutation: {};
  Query: {};
  ID: Scalars['ID']['output'];
  TimeSlot: TimeSlot;
  User: UserMapper;
};

export type AppointmentCodeResolvers = EnumResolverSignature<{ BAPTISM?: any, ECCLESIASTICAL_ENDORSEMENT?: any, MISSION?: any, OTHER?: any, PATRIARCHAL_BLESSING?: any, PERSONAL_MATTER_LONG?: any, PERSONAL_MATTER_SHORT?: any, TEMPLE_RECOMMEND?: any, TEMPLE_RECOMMEND_RENEWAL?: any, TEMPLE_WORKER?: any, TITHING_DECLARATION?: any }, ResolversTypes['AppointmentCode']>;

export type AppointmentErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppointmentError'] = ResolversParentTypes['AppointmentError']> = {
  code?: Resolver<Maybe<ResolversTypes['AppointmentErrorCodes']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppointmentErrorCodesResolvers = EnumResolverSignature<{ APPOINTMENT_CONFLICT?: any, INVALID_TIME_SLOT?: any, UNKNOWN_ERROR?: any }, ResolversTypes['AppointmentErrorCodes']>;

export type AppointmentPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppointmentPayload'] = ResolversParentTypes['AppointmentPayload']> = {
  bishopricMember?: Resolver<Maybe<ResolversTypes['BishopricMember']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['AppointmentError']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  timeSlot?: Resolver<Maybe<ResolversTypes['TimeSlot']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppointmentTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppointmentType'] = ResolversParentTypes['AppointmentType']> = {
  code?: Resolver<ResolversTypes['AppointmentCode'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  durationInMinutes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  interviewers?: Resolver<Array<ResolversTypes['BishopricMember']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AvailabilityBlockResolvers<ContextType = any, ParentType extends ResolversParentTypes['AvailabilityBlock'] = ResolversParentTypes['AvailabilityBlock']> = {
  availableSlot?: Resolver<Maybe<ResolversTypes['TimeSlot']>, ParentType, ContextType, RequireFields<AvailabilityBlockavailableSlotArgs, 'durationInMinutes'>>;
  bishopricMember?: Resolver<Maybe<ResolversTypes['BishopricMember']>, ParentType, ContextType>;
  end?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  priorityDirection?: Resolver<Maybe<ResolversTypes['PriorityDirection']>, ParentType, ContextType>;
  start?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BishopricMemberResolvers = EnumResolverSignature<{ BISHOP?: any, FIRST_COUNSELOR?: any, SECOND_COUNSELOR?: any }, ResolversTypes['BishopricMember']>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type GenericErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['GenericError'] = ResolversParentTypes['GenericError']> = {
  __resolveType?: TypeResolveFn<'AppointmentError', ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createAppointment?: Resolver<ResolversTypes['AppointmentPayload'], ParentType, ContextType, RequireFields<MutationcreateAppointmentArgs, 'input'>>;
};

export type PriorityDirectionResolvers = EnumResolverSignature<{ ASC?: any, DESC?: any }, ResolversTypes['PriorityDirection']>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  allAppointmentTypes?: Resolver<Array<ResolversTypes['AppointmentType']>, ParentType, ContextType>;
  allAvailabilityBlocks?: Resolver<Array<ResolversTypes['AvailabilityBlock']>, ParentType, ContextType>;
  availabilityBlocks?: Resolver<Array<ResolversTypes['AvailabilityBlock']>, ParentType, ContextType, RequireFields<QueryavailabilityBlocksArgs, 'bishopricMember'>>;
  availableTimeSlots?: Resolver<Array<Maybe<ResolversTypes['TimeSlot']>>, ParentType, ContextType, RequireFields<QueryavailableTimeSlotsArgs, 'bishopricMember' | 'durationInMinutes'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryuserArgs, 'id'>>;
};

export type TimeSlotResolvers<ContextType = any, ParentType extends ResolversParentTypes['TimeSlot'] = ResolversParentTypes['TimeSlot']> = {
  end?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  start?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  fullName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isAdmin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AppointmentCode?: AppointmentCodeResolvers;
  AppointmentError?: AppointmentErrorResolvers<ContextType>;
  AppointmentErrorCodes?: AppointmentErrorCodesResolvers;
  AppointmentPayload?: AppointmentPayloadResolvers<ContextType>;
  AppointmentType?: AppointmentTypeResolvers<ContextType>;
  AvailabilityBlock?: AvailabilityBlockResolvers<ContextType>;
  BishopricMember?: BishopricMemberResolvers;
  DateTime?: GraphQLScalarType;
  GenericError?: GenericErrorResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PriorityDirection?: PriorityDirectionResolvers;
  Query?: QueryResolvers<ContextType>;
  TimeSlot?: TimeSlotResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

