import { updateLeadToNegotiationRepository } from "../Repository/Negotiation.Repository";

export const updateLeadToNegotiationService = async (
  leadId: string,
  commentNegotiation: string,
  documents: string[] | undefined,
  Quatation: number,
  employeeId: string,
  role?:string
) => {
  try {
    return await updateLeadToNegotiationRepository(
      leadId,
      commentNegotiation,
      documents,
      Quatation,
      employeeId,
      role
    );
  } catch (error: any) {
    throw new Error("Service Error (negotiation): " + error.message);
  }
};
