import { RequestContext } from '../../../../context';
import { safeAsync } from '../../../../utilities/safeAsync';
import type { MutationResolvers } from './../../../types.generated';

export const createAppointment: NonNullable<MutationResolvers['createAppointment']> = async (_parent, _arg, { dataSources }: RequestContext) => {
    const [error, appointmentType] = await safeAsync(dataSources.appointmentDetails().getAppointmentTypeById(_arg.input.id));
    if (error) {
        return {
            success: false,
            error: {
                code: "APPOINTMENT_TYPE_NOT_FOUND",
                message: "The specified appointment type was not found"
            }
        }
    }
    
    return dataSources.calendar().createAppointment({
        ..._arg.input,
        type: appointmentType.name
    });
};