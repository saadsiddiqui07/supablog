import Head from "next/head";
import { supabase } from "../../client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface UserBlogDataProps {
  id: number;
  title: string;
  content: string;
  userEmail: string;
  created_at: any;
}

const Blog = () => {
  const [userData, setUserData] = useState<UserBlogDataProps>();
  const [authUserEmail, setAuthUserEmail] = useState<string | undefined>("");
  const { asPath, back, replace, push } = useRouter();
  const blogId = asPath.split("/").pop();
  const isAuthenticated = userData?.userEmail === authUserEmail;

  useEffect(() => {
    getBlogInfo();
  }, []);

  // edit on new route
  const handleEditBlog = () => {
    push(`/update/${blogId}`);
  };

  // get data for a specific blog
  const getBlogInfo = async () => {
    try {
      let { error, data } = await supabase
        .from("posts")
        .select("title, content, created_by, created_at, id")
        .eq("id", blogId);
      if (error) throw error;
      if (data) {
        let blogData = Object.assign({}, ...data);
        setUserData({
          title: blogData.title,
          content: blogData.content,
          userEmail: blogData.created_by,
          created_at: blogData.created_at,
          id: blogData.id,
        });
      }

      const user = supabase.auth.user();
      setAuthUserEmail(user?.email);
    } catch (error: any) {
      alert(error.message);
    }
  };

  // delete a post
  const deletePost = async () => {
    await supabase.from("posts").delete().match({ id: blogId });
    replace("/blogs");
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col ">
      <Head>
        <title>Blogs: Blog-{blogId}</title>
      </Head>
      <main className="max-w-5xl w-full mx-auto min-h-screen ">
        <div className="w-[80%] m-10 mx-auto flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <h1 className="text-[25px] md:text-[35px] text-semibold">
              {userData?.title}
            </h1>
            <div className="flex flex-col sm:p-2 my-2 sm:py-0 text-gray-400">
              <small>Posted by: {userData?.userEmail}</small>
              <small>
                At: {new Date(userData?.created_at).toLocaleString()}
              </small>
            </div>
          </div>
          <p className="text-gray-300 mt-4">{userData?.content}</p>

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

export default Blog;
