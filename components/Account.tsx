import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../client";
import Image from "next/image";

const Account = ({ session }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<any>(null);
  const [website, setWebsite] = useState<any>(null);
  const [avatar_url, setAvatarUrl] = useState<any>(null);
  const [update, setUpdate] = useState<boolean>(true);
  const router = useRouter();

  // get user's info
  const getUserInfo = async () => {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { status, data, error } = await supabase
        .from("profiles")
        .select("username, website, avatar_url")
        .eq("id", user?.id)
        .single();

      // handle error
      if (error && status !== 406) {
        throw error;
      }

      // store data in the state
      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [session]);

  // update user's profile
  const updateUserProfile = async ({ username, website, avatar_url }: any) => {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let updateInfo = {
        id: user?.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      let { error } = await supabase
        .from("profiles")
        .upsert(updateInfo, { returning: "minimal" });
      // handle error
      if (error) {
        throw error;
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
      setUpdate(true);
    }
  };

  const handleLogout = () => {
    supabase.auth.signOut();
  };

  return (
    <div className=" min-h-screen w-100vw  flex flex-col items-center justify-center">
      <button
        onClick={() => router.replace("/blogs")}
        className="text-black text-xs md:text-sm hover:bg-gray-200 bg-white p-1 sm:p-2 font-semibold rounded-md"
      >
        Read Blogs!
      </button>
      <div className="flex flex-row items-center w-[90%] mx-auto md:w-[60%] p-3 justify-between">
        <small>{loading ? "Fecthing data..." : "You are logged in!"}</small>
        <button
          disabled={!update}
          onClick={() => setUpdate(!update)}
          className="bg-blue-500 text-[12px] md:text-sm hover:bg-blue-700 disabled:bg-gray-500 text-white p-1 rounded-lg md:font-bold"
        >
          Edit info
        </button>
      </div>
      <div className="flex flex-col w-[90%] mx-auto  md:w-[60%] m-2 md:m-4">
        <div className="flex flex-row p-2 items-center">
          <div className="hidden md:inline-flex">
            <Image
              src={
                "https://s4-recruiting.cdn.greenhouse.io/external_greenhouse_job_boards/logos/400/588/400/original/supabase-logo-icon.png?1646035181"
              }
              alt=""
              height={100}
              width={100}
              layout="fixed"
              objectFit="contain"
              className="hidden"
            />
          </div>
          <div className="flex flex-col ml-auto w-full">
            <label className="text-gray-600 text-xs sm:text-sm">
              Avatar Url
            </label>
            <input
              placeholder="Enter Avatar Url"
              className="outline-0 text-xs sm:text-sm md:text-md flex-1 border-none disabled:bg-black bg-gray-900 p-2 rounded-lg"
              disabled={update}
              value={avatar_url || ""}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm">Username</label>
            <input
              placeholder="Enter your username"
              className="outline-0 text-xs sm:text-sm md:text-md  border-none bg-gray-900 p-2 disabled:bg-black rounded-lg"
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
              disabled={update}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm">website</label>
            <input
              placeholder="Enter your website"
              className="outline-0 text-xs sm:text-sm md:text-md border-none text-xs sm:text-md bg-gray-900 p-2 disabled:bg-black rounded-lg"
              value={website || ""}
              onChange={(e) => setWebsite(e.target.value)}
              disabled={update}
            />
          </div>
        </div>

        <button
          onClick={() => updateUserProfile({ username, website, avatar_url })}
          disabled={loading}
          className="bg-green-600 my-4 p-2 rounded-lg text-xs md:text-sm font-bold"
        >
          {loading ? "Loading..." : "Update!"}
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 p-2 rounded-lg text-xs md:text-sm font-bold"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Account;
