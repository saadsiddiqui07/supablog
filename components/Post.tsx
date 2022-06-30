import { useRouter } from "next/router";
import BlogPropsType from "../types/BlogPropsType";

interface PostProps {
  post: BlogPropsType;
}

// utils function
const truncateContent = (str: string, lenStr: number): string => {
  return str?.length > lenStr ? str.slice(0, lenStr - 1) + "..." : str;
};

const Post = ({ post }: PostProps) => {
  const router = useRouter();

  // read one specific blog
  const handleReadBlog = () => {
    router.push(`/blogs/${post.id}`);
  };

  return (
    <div className="flex flex-col p-2 cursor-pointer group border-[3px] border-solid border-gray-900 hover:shadow-xl hover:shadow-gray-800 rounded">
      <p className="font-bold my-2 text-md duration-300 group-hover:text-teal-500">
        {post.title}
      </p>
      <small className="text-xs md:text-md text-gray-400 my-4 flex-start group-hover:text-white">
        {truncateContent(post.content, 190)}
      </small>
      <button
        className="mt-auto text-xs rounded m-2 px-2 py-1 w-min bg-blue-600"
        onClick={handleReadBlog}
      >
        Read
      </button>
    </div>
  );
};

export default Post;
