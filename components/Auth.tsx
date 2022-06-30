import { ChangeEvent, useState } from "react";
import { supabase } from "../supabase/client";

const Auth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // function to send link for login
  const handleLogin = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
      setEmail("");
    }
  };

  return (
    <div className="flex flex-col bg-black min-h-screen w-[100%] justify-center items-center">
      <main className="p-2 flex flex-col w-[90%] sm:w-[60%] items-center justify-center">
        <h1 className="font-bold my-4 ">Supabase + Next.js</h1>
        <input
          placeholder="Enter your email"
          value={email}
          onChange={handleChange}
          className="bg-gray-900 outline-0 w-full placeholder:text-center text:sm md:text-lg py-2 px-3"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            handleLogin(email);
          }}
          className="text-[#3DCF8E] border-solid my-2 w-full boder-gray-200 p-2 rounded-lg"
          disabled={loading}
        >
          {loading ? "Loading.." : "Submit Email"}
        </button>
      </main>
    </div>
  );
};

export default Auth;
