"use client";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { setUser } from "@redux/slice";
import { clsx } from "@utils/shared";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";
import { useEffect, useState } from "react";

import { SIGNED_IN_LINKS, SIGNED_OUT_LINKS } from "./constants";

export interface NavLinksProps {
  keyPrefix: string;
}

const navButtonClassName =
  "rounded-md px-4 py-2 transition-colors duration-100 items-center font-semibold flex hover:text-blue-500";

const NavLink = ({ href, className, ...rest }: ComponentPropsWithoutRef<typeof Link>) => (
  <Link href={href} className={navButtonClassName} {...rest} />
);

const UserInfo = () => {
  const router = useRouter();
  const { user, loading } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const removeErrorTimer = setTimeout(() => setErrorMessage(""), 5000);
    return () => clearTimeout(removeErrorTimer);
  }, [errorMessage]);

  const logout = async () => {
    const res = await fetch("/beta/api/auth/logout", {
      method: "POST",
    });
    if (res.ok) {
      dispatch(
        setUser({
          user: null,
          refresh: router.refresh,
        }),
      );
    } else {
      setErrorMessage((await res.json()).error ?? "unknown error");
    }
  };

  if (loading) {
    return <div className={navButtonClassName}>Loading...</div>;
  }
  if (!user) {
    return (
      <NavLink className={navButtonClassName} href="/login">
        Login
      </NavLink>
    );
  }
  return (
    <>
      <button
        className={clsx(
          "flex w-auto items-center rounded-full px-1 hover:bg-blue-100",
          "user-grandmaster",
        )}
      >
        <Image
          src={user.avatar}
          width={30}
          height={30}
          alt="user avatar"
          className="mr-1 rounded-full border-[1px]"
        />
        <div className="inline font-bold">{user.name}</div>
      </button>
      <button className={clsx(navButtonClassName, "text-left")} onClick={logout}>
        Logout
      </button>
      {errorMessage && (
        <p
          className={clsx(
            navButtonClassName,
            "flex border-red-200 bg-red-100 text-red-800 hover:bg-red-50 sm:w-fit",
          )}
        >
          {errorMessage}
        </p>
      )}
    </>
  );
};

export const NavLinks = ({ keyPrefix }: NavLinksProps) => {
  const { user, loading } = useAppSelector((state) => state.user);
  const links = !loading ? (user ? SIGNED_IN_LINKS : SIGNED_OUT_LINKS) : [];
  return (
    <>
      {links.map(({ url, title }) => (
        <NavLink className={navButtonClassName} key={`${keyPrefix}-${title}`} href={url}>
          {title}
        </NavLink>
      ))}
      <UserInfo />
    </>
  );
};
