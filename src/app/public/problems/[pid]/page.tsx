import { getProblemInfo } from "@utils/api";
import type { Metadata } from "next";
import { cookies } from "next/headers";

import { UserEditor } from "@/app/problems/[pid]/Editor";
import { InfoTable } from "@/app/problems/[pid]/InfoTable";
import { Box, Heading } from "@/components";

export const metadata: Metadata = {
  title: "Problem",
};

const Page = async ({ params: { pid } }: { params: { pid: string } }) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  const problemData = await getProblemInfo(pid, token?.value);

  if (!problemData.ok) {
    console.error(problemData.status, problemData.error);
    return (
      <div className="flex h-full w-full items-center justify-center self-center">
        <Box>
          <Heading type="display">Error fetching data</Heading>
          <Heading type="title">Maybe try to reload?</Heading>
        </Box>
      </div>
    );
  }

  if (problemData.user) {
    console.error("Wrong authentification behaviour");
    return (
      <div className="flex h-full w-full items-center justify-center self-center">
        <Box>
          <Heading type="display">Internal server error occured.</Heading>
          <Heading type="title">Maybe try refreshing</Heading>
        </Box>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full flex-col items-start gap-6 self-stretch px-3 py-5 md:max-w-7xl md:flex-row md:gap-4 md:px-2 md:py-10 lg:gap-8 lg:px-4">
      <div className="h-auto w-full md:flex-[1_1_0]">
        <InfoTable data={{ user: problemData.user, problemData: problemData.data }} pid={pid} />
      </div>
      <div className="flex h-full w-full md:flex-[2_2_0]">
        <UserEditor data={{ user: problemData.user, problemData: problemData.data }} pid={pid} />
      </div>
    </div>
  );
};

export default Page;
