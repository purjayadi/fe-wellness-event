import { useSession } from "next-auth/react";

// date format from date
export function dateFormatFromDate(date: Date): string {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// string to date
export function stringToDate(str: string): Date {
  return new Date(str);
}

export const paginationProps = {
  showSizeChanger: true,
  pageSizeOptions: ["5", "10", "20", "30", "40", "50"],
  size: "default",
};

// parse jwt
function parseJwt(token: string): any {
  return JSON.parse(atob(token.split(".")[1]));
}

// get user from jwt
export function getUserFromJwt(): any {
  const {data: session} = useSession();
  const token = session?.accessToken;
  if (token) {
    // @ts-ignore
    return parseJwt(token);
  }
  return null;
}

// get user role from jwt
export function getUserRoleFromJwt(): any {
  const {data: session} = useSession();
  const token = session?.accessToken;
  if (token) {
    // @ts-ignore
    return parseJwt(token).user.role;
  }
  return null;
}

