import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";
import { getSession } from "@auth0/nextjs-auth0";

export default function Home() {
  const { isLoading, error, user } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <>
      <Head>
        <title>Lawfinity - Login or Signup</title>
      </Head>
      <div className=" bg-primary text-primary flex min-h-screen w-full items-center justify-center text-center">
        <div>
          <Image
            src={"/LawfinityLogo.png"}
            alt="logo image"
            width={100}
            height={100}
            priority="true"
            className="mx-auto"
          />

          <h1 className="m-5 text-4xl font-bold">Welcome to Lawfinity</h1>
          {!!user && <Link href="/api/auth/logout">Logout</Link>}
          {!user && (
            <div>
              <Link href="api/auth/login" className="btn m-5">
                Login
              </Link>
              <Link href="/api/auth/signup" className="btn m-5">
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx.req, ctx.res);
  if (!!session) {
    return {
      redirect: {
        destination: "/chat",
      },
    };
  }

  return {
    props: {},
  };
};
