import { getAllProblem, getProblemCount } from "@utils/api";
import type { Metadata } from "next";
import { cookies } from "next/headers";

import { Box, Heading, Pagination } from "@/components";

import { ProblemsList } from "./ProblemList";

export const metadata: Metadata = {
  title: "Problems",
};

const Page = async ({ params: { page } }: { params: { page: string } }) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  const [problemCount, problemsList] = await Promise.all([
    getProblemCount(),
    getAllProblem(token?.value, page, "50"),
  ]);

  if (!problemsList.ok || !problemCount.ok) {
    if (!problemsList.ok) {
      console.error(problemsList.status, problemsList.error);
    }
    if (!problemCount.ok) {
      console.error(problemCount.status, problemCount.error);
    }
    return (
      <div className="flex h-full w-full items-center justify-center self-center">
        <Box>
          <Heading type="display">Failed to fetch problems.</Heading>
          <Heading type="title">Maybe try refreshing?</Heading>
        </Box>
      </div>
    );
  }
  if (!problemsList.user || !token) {
    console.error("Wrong authentication behaviour");
    return (
      <div className="flex h-full w-full items-center justify-center self-center">
        <Box>
          <Heading type="display">Internal server error occured.</Heading>
          <Heading type="title">Maybe try refreshing</Heading>
        </Box>
      </div>
    );
  }

  const lastPage = Math.ceil(problemCount.count / 50).toString();

  return (
    <>
      <div className="relative mx-auto flex w-full max-w-4xl flex-col p-4 ">
        <Pagination page={page} baseURL="/problems/all/" lastPage={lastPage} />
        <ProblemsList
          data={{ user: problemsList.user, problemList: problemsList.data }}
          page={page}
        />
        {problemsList.data.length > 0 && (
          <Pagination page={page} baseURL="/problems/all/" lastPage={lastPage} />
        )}
      </div>
    </>
  );
};

export default Page;
