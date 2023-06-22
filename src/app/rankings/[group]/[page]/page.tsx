import type { Metadata } from "next";

import { Box, Heading } from "@/components";

import { Group } from "./Group";
import { Pagination } from "./Pagination";
import { RankTable } from "./RankTable";
import type { GroupsData, RankingsData } from "./types";

export const metadata: Metadata = {
  title: "Rankings",
};

const getRankings = async (
  group: string,
  page: string,
  limit: string,
): Promise<RankingsData | null> => {
  const bodyData = { group, pageid: page, limit };
  const requestRanking = await fetch(
    `https://debug.codefun.vn/api/rankings?${new URLSearchParams(bodyData).toString()}`,
    {
      method: "GET",
    },
  );
  if (!requestRanking.ok) {
    const error = await requestRanking.text();
    console.error(
      "Failed to fetch rankings",
      requestRanking.status,
      requestRanking.statusText,
      error,
    );
    return null;
  }
  return (await requestRanking.json()) ?? [];
};

const getGroups = async (): Promise<GroupsData | null> => {
  const requestGroups = await fetch("https://codefun.vn/api/groups", {
    method: "GET",
  });
  if (!requestGroups.ok) {
    const error = await requestGroups.text();
    console.error("Failed to fetch groups", requestGroups.status, requestGroups.statusText, error);
    return null;
  }
  return (await requestGroups.json()).data;
};

const Page = async ({ params: { group, page } }: { params: { group: string; page: string } }) => {
  const rankingRequest = getRankings(group.toString(), page.toString(), "50");
  const groupsRequest = getGroups();

  const [rankingData, groupsData] = await Promise.all([rankingRequest, groupsRequest]);

  if (!groupsData || !rankingData) {
    return (
      <div className="flex h-full w-full items-center justify-center self-center">
        <Box>
          <Heading type="display">Failed to fetch rankings.</Heading>
          <Heading type="title">Maybe try refreshing?</Heading>
        </Box>
      </div>
    );
  }

  return (
    <>
      <div className="relative mx-auto mb-12 flex w-full max-w-5xl flex-col p-4 md:p-10">
        <Group group={group} groupsData={groupsData}></Group>
        <RankTable rankingData={rankingData} page={page}></RankTable>
      </div>
      <Pagination group={group} page={page}></Pagination>
    </>
  );
};

export default Page;
