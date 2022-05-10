import { useSession } from 'next-auth/react';

export const UserId = (): string => {
    const { data: session } = useSession();
    // @ts-ignore
    return session?.user?.id;
}