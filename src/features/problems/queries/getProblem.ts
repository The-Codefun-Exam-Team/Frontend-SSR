import prisma from "@database/prisma/instance";
import { unstable_cache, unstable_noStore } from "next/cache";
import { cache } from "react";

import type { DetailedProblemInfo } from "@/features/problems";
import type { FunctionReturnType } from "@/types";
import { LANGUAGES_DICT } from "@/types";
import { handleCatch, parseJudge } from "@/utils";

export const getProblem = async (
  code: string,
): Promise<FunctionReturnType<DetailedProblemInfo>> => {
  unstable_noStore();
  try {
    const data = await unstable_cache(
      async () => {
        const query = await prisma.debugProblems.findUniqueOrThrow({
          where: {
            debugProblemCode: code,
          },
          select: {
            id: true,
            debugProblemCode: true,
            name: true,
            submission: {
              select: {
                language: true,
                source: true,
                problem: {
                  select: {
                    problemCode: true,
                    name: true,
                  },
                },
                judgeOutput: true,
              },
            },
          },
        });
        return {
          id: query.id,
          debugProblemCode: query.debugProblemCode,
          name: query.name,
          language: LANGUAGES_DICT[query.submission.language],
          source: query.submission.source,
          statement: {
            code: query.submission.problem.problemCode,
            name: query.submission.problem.name,
          },
          judge: parseJudge(query.submission.judgeOutput),
        };
      },
      [`getProblem-${code}`],
      { revalidate: false },
    )();
    return {
      ok: true,
      data: data,
    };
  } catch (e) {
    return handleCatch(e);
  }
};

export const getProblemWithMemo = cache(getProblem);
