import { JobModel, AppliedJobModel } from "../Modals/Careers.Modals";

export const createJobRepository = async (data: any) => {
  try {
    return await JobModel.create(data);
  } catch (err: any) {
    throw new Error("Repo error: " + err.message);
  }
};

export const editJobRepository = async (data: any, id: string) => {
  try {
    const job = await JobModel.findByIdAndUpdate(id, { $set: data });
    if (!job) throw new Error("Job not existed");
  } catch (err: any) {
    throw new Error("Repo error: " + err.message);
  }
};

export const getAllJobsRepository = async (reqFromLead: boolean, page: number, limit: number, draft: boolean, published: boolean) => {
  try {
    let jobs = [];
    let query = JobModel.find({ draft, published });

    if (!reqFromLead) {
      jobs = query.select("jobTitle _id experience jobKey") as any;
    }else{
      jobs = await JobModel.aggregate([
        {
          $lookup: {
            from: 'appliedjobs',  
            localField: '_id',
            foreignField: 'jobId',
            as: 'appliedCandidates'
          }
        },
        {
          $addFields: {
            appliedCount: { $size: '$appliedCandidates' }
          }
        },
        {
          $project: {
            appliedCandidates: 0
          }
        },
        {
          $sort: { updatedAt: -1 }
        },
        {
          $match: {draft: draft, published: published}
        },
        {
          $skip: (page - 1) * limit
        },
        {
          $limit: limit
        }
    ])};

    return jobs;
  } catch (err: any) {
    throw new Error("Repo error: " + err.message);
  }
};

export const getJobByIdRepository = async (id: string) => {
  try {
    return await JobModel.findById(id);
  } catch (err: any) {
    throw new Error("Repo error: " + err.message);
  }
};

export const applyJobRepository = async (data: any) => {
  try {
    return await AppliedJobModel.create(data);
  } catch (err: any) {
    throw new Error("Repo error: " + err.message);
  }
};


export const deleteJobRepo = async (
  jobId: string,
) => {
  try {
    const gal = await JobModel.findById(jobId);
    if (!gal) throw new Error("Job not found!");
    await gal.deleteOne();
    return "Job deleted successfully!";

  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const publishJobRepo = async (id: string, published: boolean, draft: boolean) => {
  try {
    return await JobModel.findByIdAndUpdate(id, { published, draft });
  } catch (err: any) {
    throw new Error("Repo error: " + err.message);
  }
};

export const unpublishJobRepo = async (id: string, published: boolean, draft: boolean) => {
  try {
    return await JobModel.findByIdAndUpdate(id, { published, draft });
  } catch (error) {

  }
}


export const getAppliedJobsRepository = async (jobId: string) => {
  try {
    const jobs = AppliedJobModel.find({ jobId })
    return jobs;
  } catch (err: any) {
    throw new Error("Repo error: " + err.message);
  }
};


export const deleteAppliedJobRepo = async (
  appliedJobId: string,
) => {
  try {
    const job = await AppliedJobModel.findById(appliedJobId);
    if (!job) throw new Error("Job not found!");
    await job.deleteOne();
    return "Applied Job deleted successfully!";

  } catch (err: any) {
    throw new Error(err.message);
  }
};