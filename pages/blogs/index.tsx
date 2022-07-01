import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../supabase/client";
import Post from "../../components/Post";
import BlogPropsType from "../../types/BlogPropsType";

// ADD FUNCTION TO UPLOAD IMAGE IN THE SUPABASE STORAGE

const Blogs = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [userInfo, setUserInfo] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<BlogPropsType[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  let [image, setImage] = useState<string>("");
  const imagePickerRef = useRef<any>(null);
  const router = useRouter();
  const emptyInput = !title || !content;

  // select image to post
  const handleImageChange = (e: any) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  // get user data
  const getUserProfile = () => {
    const user = supabase.auth.user();
    setUserInfo(user?.email);
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  // fetch all posts
  const fetchAllPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select()
      .order("id", { ascending: false });
    if (error) throw Error;
    setPosts(data);
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  // create a new post
  const createNewPost = async () => {
    try {
      setLoading(true);
      // upload an image
      if (selectedFile) {
        let { data, error } = await supabase.storage
          .from("postimages")
          .upload(`${Date.now()}_${selectedFile?.name}`, selectedFile);
        if (data) {
          setImage(data.Key);
          image = data.Key;
        }
        if (error) throw error;
      }
      // insert data in the database
      await supabase
        .from("posts")
        .upsert([
          {
            title,
            content,
            created_by: userInfo,
            postImage: image
              ? `https://qhziunnvlmdifpxaxxzz.supabase.co/storage/v1/object/public/${image}`
              : "",
          },
        ])
        .single();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
      setSelectedFile(null);
      setImage("");
      setTitle("");
      setContent("");
      fetchAllPosts();
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center bg-black text-white">
      <Head>
        <title>Supablog - Blogs</title>
      </Head>
      <button
        onClick={() => router.push("/")}
        className="ml-auto text-xs md:text-sm rounded-lg hover:bg-white hover:text-black py-1 px-2 md:py-2 md:px-3 border-2 border-solid border-white mr-[50px] mt-4"
      >
        View Profile
      </button>
      <div className="flex p-4 w-[90%] sm:w-[70%]  mx-auto flex-col">
        <h1 className="text-md sm:text-xl">Write a blog!</h1>
        <div className="flex items-center w-[100%]">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-900 text-sm md:text-md flex-1 lg:text-lg p-2 rounded-lg text-white my-2 outline-0 border-none font-semibold placeholder:font-normal"
            placeholder="Enter title"
          />
          <input
            hidden
            type="file"
            onChange={handleImageChange}
            ref={imagePickerRef}
          />
          <div className="flex items-center">
            <button
              onClick={() => imagePickerRef.current.click()}
              className="p-2 ml-3 rounded-md w-full bg-teal-600 hover:bg-blue-600 text-[10px] sm:text-xs md:text-sm"
            >
              {selectedFile ? selectedFile?.name : "Select an Image!"}
            </button>
            {selectedFile && (
              <p
                onClick={() => setSelectedFile(!selectedFile)}
                className="font-bold text-red-600 mx-2 cursor-pointer"
              >
                X
              </p>
            )}
          </div>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="bg-gray-900 p-2 rounded-lg text-sm md:text-md lg:text-lg text-white my-2 outline-0 border-none text-gray-200 placeholder:font-normal"
          placeholder="Enter content"
          rows={2}
        />
        <button
          onClick={createNewPost}
          disabled={loading || emptyInput}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-xs sm:text-md p-2"
        >
          {loading ? "Uploading...." : "Post!"}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 w-[90%] mx-auto sm:w-[70%] p-4 gap-3">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Blogs;
