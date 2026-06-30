import { getAppliedJobsController } from "../Controllers/Careers.Controllers";
import { createJobRepository, getAllJobsRepository, getJobByIdRepository, applyJobRepository, deleteJobRepo, editJobRepository, unpublishJobRepo, publishJobRepo, getAppliedJobsRepository, deleteAppliedJobRepo } from "../Repositroy/Careers.Repository";

export const createJobService = async (data: any) => {
  try {
    return await createJobRepository(data);
  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
};

export const editJobService = async (data: any, id: string) => {
  try {
    return await editJobRepository(data, id);
  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
};

export const getAllJobsService = async (reqFromLead: boolean, page: number, limit: number,  draft: boolean, published: boolean) => {
  try {
    return await getAllJobsRepository(reqFromLead, page, limit,  draft, published);

  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
};

export const getJobByIdService = async (id: string) => {
  try {
    const job=await getJobByIdRepository(id);
    if(!job){
       throw new Error("No JOb found");
         
    }
    return job;
  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
};

export const applyJobService = async (data: any) => {
  console.log(data)
  try {
    return await applyJobRepository(data);
  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
};

export const deleteJobService = async (
  jobId: string,
) => {
  try {
    await deleteJobRepo(jobId);
    return "Job Deleted Successfully!"
  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
};

export const publishJobService = async (id: string,published:boolean,draft:boolean) => {
  try {
    await publishJobRepo(id,published,draft);
    return "Job Published Successfully!";
  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
};


export const unpublishJobService = async (id: string,published:boolean,draft:boolean) => {
  try {
    await unpublishJobRepo(id,published,draft);
    return "Job Unpublished Successfully!";
  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
};

export const getAppliedJobsService = async (id: string) => {
  try {
    const appliedJobs = await getAppliedJobsRepository(id);
    return appliedJobs;
  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
};

export const deleteAppliedJobService = async (
  jobId: string,
) => {
  try {
    await deleteAppliedJobRepo(jobId);
    return "Applied Job Deleted Successfully!"
  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
};
