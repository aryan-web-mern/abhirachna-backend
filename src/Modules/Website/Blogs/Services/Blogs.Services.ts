import { createBlogRepository, deleteBlogRepo, getAllBlogsRepository, getBlogByIdRepository, getLikedBlogsRepository, getSavedBlogsRepository, likeBlogRepository, publishBlogRepo, saveBlogRepository, unpublishBlogRepo, updateBlogRepo } from "../Repository/Blogs.Repository";

export const createBlogService = async (data: any) => {
  try {
    return await createBlogRepository(data);
  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
};

export const getAllBlogsService = async (page: number, limit: number, userId?: string,draft?:boolean,published?:boolean) => {
  try {
    const result = await getAllBlogsRepository(page, limit, userId,draft,published);
    return result;
  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
};


export const getBlogByIdService = async (id: string, userId?: string) => {
  try {
    const blog = await getBlogByIdRepository(id, userId);
    if (!blog) throw new Error("Blog not found");
    return blog;

  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
};

export const likeBlogService = async (blogId: string, userId: string) => {
  try {
    return await likeBlogRepository(blogId, userId);
  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
};

export const saveBlogService = async (blogId: string, userId: string) => {
  try {
    return await saveBlogRepository(blogId, userId);
  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
};

export const getFilteredBlogsService = async (
  userId: string,
  filter: string,
  page: number,
  limit: number
) => {
  try {
    if (filter === "like") {
      const blogs = await getLikedBlogsRepository(userId, page, limit);
      return blogs;
    } else {
      const blogs = await getSavedBlogsRepository(userId, page, limit);
      return blogs;
    }
  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
};


export const deleteBlogService = async (
  BlogId: string,
) => {
  try {
    await deleteBlogRepo(BlogId);
    return "Blog Deleted Successfully!"
  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
};

export const publishBlogService = async (id: string,published:boolean,draft:boolean) => {
  try {
    await publishBlogRepo(id,published,draft);
    return "Blog Published Successfully!";
  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
};


export const unpublishBlogService = async (id: string,published:boolean,draft:boolean) => {
  try {
    await unpublishBlogRepo(id,published,draft);
    return "Blog Unpublished Successfully!";
  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
};




export const updateBlogService=async(blogId:string, userId:string, updateData:string)=>{
  try {
    return await updateBlogRepo(blogId, userId, updateData);
  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
}