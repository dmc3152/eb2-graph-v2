/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { allAppointmentTypes as Query_allAppointmentTypes } from './calendarEvent/resolvers/Query/allAppointmentTypes';
import    { allAvailabilityBlocks as Query_allAvailabilityBlocks } from './calendarEvent/resolvers/Query/allAvailabilityBlocks';
import    { availabilityBlocks as Query_availabilityBlocks } from './calendarEvent/resolvers/Query/availabilityBlocks';
import    { availableTimeSlots as Query_availableTimeSlots } from './calendarEvent/resolvers/Query/availableTimeSlots';
import    { user as Query_user } from './user/resolvers/Query/user';
import    { createAppointment as Mutation_createAppointment } from './calendarEvent/resolvers/Mutation/createAppointment';
import    { AppointmentError } from './calendarEvent/resolvers/AppointmentError';
import    { AppointmentPayload } from './calendarEvent/resolvers/AppointmentPayload';
import    { AppointmentType } from './calendarEvent/resolvers/AppointmentType';
import    { AvailabilityBlock } from './calendarEvent/resolvers/AvailabilityBlock';
import    { TimeSlot } from './calendarEvent/resolvers/TimeSlot';
import    { User } from './user/resolvers/User';
import    { GenericError } from './calendarEvent/resolvers/GenericError';
import    { DateTimeResolver } from 'graphql-scalars';
    export const resolvers: Resolvers = {
      Query: { allAppointmentTypes: Query_allAppointmentTypes,allAvailabilityBlocks: Query_allAvailabilityBlocks,availabilityBlocks: Query_availabilityBlocks,availableTimeSlots: Query_availableTimeSlots,user: Query_user },
      Mutation: { createAppointment: Mutation_createAppointment },
      
      AppointmentError: AppointmentError,
AppointmentPayload: AppointmentPayload,
AppointmentType: AppointmentType,
AvailabilityBlock: AvailabilityBlock,
TimeSlot: TimeSlot,
User: User,
GenericError: GenericError,
DateTime: DateTimeResolver
    }