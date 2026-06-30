import { updateDesigningStatusRepository } from "../Repository/Design.Repositroy";

export const updateStatusToDesigningService = async (
  leadId: string,
  designerIds: string[],
  tokenReceived: boolean,
employeeId: string,
role:string
) => {
  try {
    await updateDesigningStatusRepository(leadId, designerIds, tokenReceived,employeeId,role);
  } catch (err:any) {
    throw new Error("Service error (updateStatusToDesigning): " + err.message);
  }
};
