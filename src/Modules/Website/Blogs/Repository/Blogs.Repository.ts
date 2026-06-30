import { deleteFromS3 } from "../../../../Middlewares/Multers/S3Delete/S3Delete";
import { BlogLikeModel, BlogModel, BlogSaveModel } from "../Modals/Blogs.Modals";

export const createBlogRepository = async (data: any) => {
  try {
    return await BlogModel.create(data);
  } catch (err: any) {
    throw new Error("Repo error: " + err.message);
  }
};


export const getAllBlogsRepository = async (page: number, limit: number, userId?: string,draft?:boolean,published?:boolean) => {
  try {
    const skip = (page - 1) * limit;
    let blogsData = []
    const [blogs,total, likedBlogs, savedBlogs] = await Promise.all([
      BlogModel.find({draft,published}).sort({ updatedAt: -1 }).skip(skip).limit(limit),
      BlogModel.countDocuments({draft,published}),
      BlogLikeModel.find(userId ? { userId } : {}),
      BlogSaveModel.find(userId ? { userId } : {}),
    ]);
    blogsData = blogs;

    if (userId) {
      const likedBlogIds = likedBlogs.map((l) => l.blogId.toString());
      const savedBlogIds = savedBlogs.map((s) => s.blogId.toString());

      blogsData = blogs.map((blog: any) => {
        const blogObj = blog.toObject();
        return {
          ...blogObj,
          isLiked: likedBlogIds.includes(blog._id.toString()),
          isSaved: savedBlogIds.includes(blog._id.toString()),
        };
      });
    }

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      blogs: blogsData,
    };
  } catch (err: any) {
    throw new Error("Repo error: " + err.message);
  }
};



export const getBlogByIdRepository = async (id: string, userId?: string) => {
  try {
    const Blog = await BlogModel.findById(id) as (typeof BlogModel)["prototype"] | null;
    if (!Blog) {
      throw new Error("Blog not found");
    }


    let BlogData = Blog.toObject();
    if (userId) {
      const likedBlogs = await BlogLikeModel.find(userId ? { userId } : {});
      const savedBlogs = await BlogSaveModel.find(userId ? { userId } : {});
      const likedBlogIds = likedBlogs.map((l: any) => l.blogId.toString());
      const savedBlogIds = savedBlogs.map((s: any) => s.blogId.toString());

      BlogData['isLiked'] = likedBlogIds.includes(Blog._id.toString());
      BlogData['isSaved'] = savedBlogIds.includes(Blog._id.toString());
    }

    return {
      ...BlogData
    };
  } catch (err: any) {
    throw new Error("Repo error: " + err.message);
  }
};

export const likeBlogRepository = async (blogId: string, userId: string) => {
  try {
    const alreadyLiked = await BlogLikeModel.findOne({ blogId, userId });
    if (alreadyLiked) {
      await BlogLikeModel.deleteOne({ blogId, userId });
      return { liked: false };
    }
    await BlogLikeModel.create({ blogId, userId });
    return { liked: true };
  } catch (err: any) {
    throw new Error("Repo error: " + err.message);
  }
};

export const saveBlogRepository = async (blogId: string, userId: string) => {
  try {
    const alreadySaved = await BlogSaveModel.findOne({ blogId, userId });
    if (alreadySaved) {
      await BlogSaveModel.deleteOne({ blogId, userId });
      return { saved: false };
    }
    await BlogSaveModel.create({ blogId, userId });
    return { saved: true };
  } catch (err: any) {
    throw new Error("Repo error: " + err.message);
  }
};



export const getSavedBlogsRepository = async (userId: string, page: number, limit: number) => {
  try {

    const skip = (page - 1) * limit;
    const [blogs, total, likedBlogs] = await Promise.all([
      BlogSaveModel.find(userId ? { userId } : {}).sort({ createdAt: -1 }).skip(skip).limit(limit).populate({ path: 'blogId' }),
      BlogSaveModel.countDocuments({ userId }),
      BlogLikeModel.find(userId ? { userId } : {}),
    ]);

    const likedBlogIds = likedBlogs.map((l) => l.blogId.toString());

    const blogsWithFlags = blogs.map((blog: any) => {
      const blogObj = blog.blogId.toObject();
      return {
        ...blogObj,
        isLiked: likedBlogIds.includes(blogObj?._id.toString()),
        isSaved: true,
      };
    });

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      blogs: blogsWithFlags,
    };
  } catch (err: any) {
    throw new Error("Repo error: " + err.message);
  }
};



export const getLikedBlogsRepository = async (
  userId: string | Record<string, any>,
  page = 1,
  limit = 10
) => {
  try {
    const skip = (page - 1) * limit;
    const total = await BlogLikeModel.countDocuments({ userId });
    const liked = await BlogLikeModel.find({ userId })
      .populate("blogId")
      .skip(skip)
      .limit(limit);

    const blogs = liked.map((l) => l.blogId);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      blogs,
    };
  } catch (err: any) {
    throw new Error("Repo error: " + err.message);
  }
};


export const deleteBlogRepo = async (
  BlogId: string,
) => {
  try {
    const blog = await BlogModel.findById(BlogId);
    if (!blog) throw new Error("Blog not found!");
    await blog.deleteOne();
    return "Blog deleted successfully!";

  } catch (err: any) {
    throw new Error(err.message);
  }
};



export const publishBlogRepo = async (id: string, published: boolean, draft: boolean) => {
  try {
   return await BlogModel.findByIdAndUpdate(id, { published, draft });
  } catch (err: any) {
    throw new Error("Repo error: " + err.message);
  }
};

export const unpublishBlogRepo = async (id: string, published: boolean, draft: boolean) => {
try {
   return await BlogModel.findByIdAndUpdate(id, { published, draft });
} catch (error) {
  
}

}


export const updateBlogRepo = async (blogId: string, userId: string, updateData: any) => {
  try {
    const blog = await BlogModel.findById(blogId)
    const oldBlogImage = blog?.image 
    if (!blog) throw new Error("Blog not found or user not authorized");
    await blog.updateOne(updateData);
    if(updateData?.image && oldBlogImage) await deleteFromS3(oldBlogImage) 
    return blog;
  } catch (err: any) {
    throw new Error("Repo error: " + err.message);
  }
};