import { updateLeadToClosedRepository } from "../Repository/ClosedRepository";

export interface IupdateLeadToClosed {

  Quatation: number,
  discountBysalesman: number,
  totalDiscount: number,
  amountAfterDiscount: number,
  discountByDirector: number
  userDesignation: string,
  leadId: string,
  documents: string[],
  employeeId: string,
  userId: string
}


export const updateLeadToClosedService = async (data: IupdateLeadToClosed) => {

  try {
    return await updateLeadToClosedRepository(
      data
    );
  } catch (error: any) {
    throw new Error("Service Error (negotiation): " + error.message);
  }
};
