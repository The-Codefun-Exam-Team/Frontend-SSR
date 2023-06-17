import type { Metadata } from "next";
import { cookies } from "next/headers";

import { InfoTable } from "./InfoTable";
import { RunInfo } from "./RunInfo";
import type { RunData, SubmissionsData } from "./types";

// export const generateStaticParams = () => [];

export const metadata: Metadata = {
  title: "Submissions",
};

const Page = async ({ params: { sid } }: { params: { sid: number } }) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  if (!token) {
    return <h1>Not logged in</h1>;
  }

  const requestToDebug = await fetch(`https://debug.codefun.vn/api/submission/${sid}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });
  const submissionData = (await requestToDebug.json()) as SubmissionsData;
  const requestToCodefun = await fetch(
    `https://codefun.vn/api/submissions/${submissionData.codefun_id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    },
  );
  const runData = (await requestToCodefun.json()).data as RunData;

  return (
    <div className="mx-auto flex w-full flex-col items-start justify-between gap-5 self-stretch p-2 md:mb-0 md:flex-row md:p-8">
      <div className="h-auto w-full flex-[1_1_0]">
        <InfoTable submissionData={submissionData} runData={runData} sid={sid} />
      </div>
      <div className="flex h-full w-full flex-[2_2_0] flex-col gap-2">
        <RunInfo sid={sid} runData={runData} submissionData={submissionData} />
      </div>
    </div>
  );
};

export default Page;
