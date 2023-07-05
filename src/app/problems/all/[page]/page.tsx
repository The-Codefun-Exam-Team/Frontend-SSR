import type { Metadata } from "next";
import { cookies } from "next/headers";

import { Box, Heading } from "@/components";

import { CreateProblem } from "./CreateProblem";
import { Pagination } from "./Pagination";
import { ProblemsList } from "./ProblemList";
import type { DebugProblemBrief } from "./types";

export const metadata: Metadata = {
  title: "Problems",
};

const getProblemsList = async (token: string, page: string, limit: string, language: string) => {
  const bodyData = { page_id: page, limit, language };
  const res = await fetch(
    `https://debug.codefun.vn/v3/api/problems?${new URLSearchParams(bodyData)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!res.ok) {
    const error = await res.json();
    console.log("Error fetching problems list", error);
    return null;
  }
  return (await res.json()).data as DebugProblemBrief[];
};

const Page = async ({ params: { page } }: { params: { page: string } }) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return (
      <div className="flex h-full w-full items-center justify-center self-center">
        <Box>
          <Heading type="display">You are not signed in.</Heading>
          <Heading type="title">Please sign in first, then revisit the page!</Heading>
        </Box>
      </div>
    );
  }

  const problemsList = await getProblemsList(token.value, page, "50", "");

  if (!problemsList) {
    return (
      <div className="flex h-full w-full items-center justify-center self-center">
        <Box>
          <Heading type="display">Failed to fetch problems.</Heading>
          <Heading type="title">Maybe try refreshing?</Heading>
        </Box>
      </div>
    );
  }

  return (
    <>
      <div className="relative mx-auto mb-12 flex w-full max-w-4xl flex-col p-4 md:p-10">
        <CreateProblem />
        <ProblemsList data={problemsList} page={page} />
      </div>
      <Pagination page={page} />
    </>
  );
};

export default Page;
