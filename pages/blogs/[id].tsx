import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";

interface UserBlogDataProps {
  id: number;
  title: string;
  content: string;
  created_by: string;
  created_at: any;
  postImage?: string;
}

interface BlogProps {
  blog: UserBlogDataProps[];
}

const Blog = ({ blog }: BlogProps) => {
  const blogData = Object.assign({}, ...blog);
  const [authUserEmail, setAuthUserEmail] = useState<string | undefined>("");
  const { back, replace, push } = useRouter();

  const isAuthenticated = blogData?.created_by === authUserEmail;

  useEffect(() => {
    getUserInfo();
  }, []);

  // edit on new route
  const handleEditBlog = () => {
    push(`/update/${blogData?.id}`);
  };

  // get data for a specific blog
  const getUserInfo = async () => {
    try {
      const user = supabase.auth.user();
      setAuthUserEmail(user?.email);
    } catch (error: any) {
      alert(error.message);
    }
  };

  // delete a post
  const deletePost = async () => {
    await supabase.from("posts").delete().match({ id: blogData?.id });
    await supabase.storage.from("postimages").remove([blogData?.postImage]);
    replace("/blogs");
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col ">
      <Head>
        <title>Blogs: Blog-{blogData?.id}</title>
      </Head>
      <main className="max-w-5xl w-full mx-auto min-h-screen ">
        <div className="w-[80%] m-10 mx-auto flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <h1 className="text-[25px] md:text-[35px] text-semibold">
              {blogData?.title}
            </h1>
            <div className="flex flex-col sm:p-2 my-2 sm:py-0 text-gray-400">
              <small>Posted by: {blogData?.created_by}</small>
              <small>
                Posted on: {new Date(blogData?.created_at).toDateString()}
              </small>
            </div>
          </div>
          {blogData?.postImage && (
            <Image
              priority
              src={blogData?.postImage}
              layout="responsive"
              height="30%"
              objectFit="cover"
              width="90%"
            />
          )}
          <p className="text-gray-300 mt-4">{blogData?.content}</p>

          <div className="flex w-full flex-col-reverse sm:flex-row sm:items-center justify-between">
            <button
              onClick={() => back()}
              className="text-xs sm:text-sm 
border-[1.5px] border-solid border-white
              rounded-lg hover:bg-white hover:text-black py-2 px-3 mt-4"
            >
              {" "}
              {"<-"} Go back
            </button>
            <div className="items-center gap-3 flex justify-between flex-row">
              <button
                disabled={!isAuthenticated}
                onClick={handleEditBlog}
                className="text-xs sm:text-sm  disabled:bg-gray-600  rounded-lg py-2 px-3 hover:bg-blue-700 bg-blue-600 mt-4"
              >
                Edit
              </button>
              <button
                disabled={!isAuthenticated}
                onClick={deletePost}
                className="text-xs sm:text-sm disabled:bg-gray-600  rounded-lg py-2 px-3 hover:bg-red-700 bg-red-600 mt-4"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps = async (context: any) => {
  let { data } = await supabase
    .from("posts")
    .select("title, content, created_by, created_at, id, postImage")
    .eq("id", context.query.id);

  return {
    props: {
      blog: data,
    },
  };
};

export default Blog;
