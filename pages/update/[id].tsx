import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../client";

const Update = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { asPath, replace, back } = useRouter();
  const blogId = asPath.split("/").pop();

  useEffect(() => {
    getBlogInfo();
  }, []);

  // fetch the info of the specific blog
  const getBlogInfo = async () => {
    try {
      let { error, data } = await supabase
        .from("posts")
        .select("title, content, created_by, created_at, id")
        .eq("id", blogId);
      if (error) throw error;
      if (data) {
        let blogData = Object.assign({}, ...data);
        setTitle(blogData.title);
        setContent(blogData.content);
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  // update a blog
  const updateBlog = async () => {
    try {
      setLoading(true);
      let { error } = await supabase
        .from("posts")
        .update({
          title,
          content,
        })
        .eq("id", blogId);
      if (error) {
        throw error;
      }
      replace("/blogs");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center bg-black text-white">
      <div className="flex p-4 w-[100%] md:w-[70%] mx-auto flex-col">
        <h1 className="text-xl">Edit a blog!</h1>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-gray-900 text-sm md:text-md lg:text-lg p-2 rounded-lg text-white my-2 outline-0 border-none font-semibold placeholder:font-normal"
          placeholder="Enter title"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="bg-gray-900 p-2 rounded-lg text-sm md:text-md lg:text-lg text-white my-2 outline-0 border-none text-gray-200 placeholder:font-normal"
          placeholder="Enter content"
          rows={3}
        />
        <button
          onClick={updateBlog}
          disabled={loading}
          className="bg-blue-600 hover:bg-green-600 disabled:bg-gray-500 text-xs p-2"
        >
          {loading ? "Updating...." : "Edit!"}
        </button>
        <button
          onClick={() => back()}
          className="text-xs sm:text-sm 
border-[1.5px] border-solid border-white
              rounded-lg hover:bg-white hover:text-black py-2 px-3 mt-4"
        >
          {" "}
          {"<-"} Go back
        </button>
      </div>
    </div>
  );
};

export default Update;
