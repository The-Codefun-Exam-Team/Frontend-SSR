"use client";
import { useAppDispatch } from "@redux/hooks";
import { setUser } from "@redux/slice";
import { loginSchema, type LoginSchemaType } from "@schemas/loginSchema";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Box, Heading, Input } from "@/components";

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: async (data, context, options) => {
      const zodResolver = (await import("@hookform/resolvers/zod")).zodResolver;
      return zodResolver(loginSchema)(data, context, options);
    },
  });
  const submitForm = handleSubmit(async (data) => {
    setLoading(true);
    const res = await fetch("/beta/api/auth/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const resBody = await res.json();
    if (res.ok) {
      dispatch(setUser(resBody));
      router.push(searchParams?.get("prev") || "/");
    } else {
      setServerError(resBody.error);
    }
    setLoading(false);
  });
  useEffect(() => {
    const removeErrorTimer = setTimeout(() => setServerError(""), 5000);
    return () => clearTimeout(removeErrorTimer);
  }, [serverError]);
  return (
    <div className="flex h-full w-full items-center justify-center self-center">
      <Box>
        <form onSubmit={submitForm} className="flex w-full flex-col gap-6 text-slate-700">
          <div className="text-center">
            <Heading type="title-large">Please login to continue</Heading>
          </div>
          {serverError && (
            <p className="text-md w-full border-2 border-red-200 bg-red-100 p-1 text-center font-semibold text-red-800">
              Error: {serverError}. Please try again.
            </p>
          )}
          <div>
            <Input
              id="login-form-username-input"
              label="Username"
              placeholder="Username"
              error={!!errors.username}
              errorTextId="login-form-username-error-text"
              errorText={errors.username?.message}
              disabled={loading}
              {...register("username")}
            />
          </div>
          <div>
            <Input
              id="login-form-password-input"
              type="password"
              label="Password"
              placeholder="Password"
              error={!!errors.password}
              errorTextId="login-form-password-error-text"
              errorText={errors.password?.message}
              disabled={loading}
              {...register("password")}
            />
          </div>
          <button
            type="submit"
            className="rounded-md border-2 border-slate-600 p-2 text-lg font-medium text-slate-700 transition-opacity disabled:opacity-50"
            disabled={loading}
          >
            Login
          </button>
        </form>
      </Box>
    </div>
  );
};
