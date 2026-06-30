import { updateToTalkingRepository } from "../Repository/TallkingLead.Repository";


export const updateToTalkingService = async ({
  leadId,
  userId,
  leadQuality,
  commentsTalking,
  memberIds,
  assignedSurveyor,
  role
}: {
  leadId: string;
  userId: string;
  leadQuality: "cold" | "hot" | "medium";
  commentsTalking: string;
  memberIds: string[];
  assignedSurveyor: string;
  role?:string
}) => {
  try {
    await updateToTalkingRepository(leadId, userId, leadQuality, commentsTalking, memberIds, assignedSurveyor,role);
  } catch (error:any) {
    throw new Error(`Service Error: ${error.message}`);
  }
};
