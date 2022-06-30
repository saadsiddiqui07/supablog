import Head from "next/head";
import type { NextPage } from "next";
import { supabase } from "../client";
import { useEffect, useState } from "react";
import Auth from "../components/Auth";
import Account from "../components/Account";

const Home: NextPage = () => {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    setSession(supabase.auth.session());
    // when the auth state changes
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div className="bg-black text-white">
      <Head>
        <title>Supablog App</title>
      </Head>
      <main className="max-w-4xl grid mx-auto flex flex-col">
        {!session ? (
          <Auth />
        ) : (
          <Account key={session.user.id} session={session} />
        )}
      </main>
    </div>
  );
};

export default Home;
