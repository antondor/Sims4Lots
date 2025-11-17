import React from "react";
import { LotAuthor } from "@/components/lots/lot-author";
import type { Lot } from "@/types/lots";

type Props = {
    user: Lot["user"];
};

export const LotAuthorAside: React.FC<Props> = ({ user }) => {
    return (
        <aside className="rounded-xl border p-4 md:p-5">
            <h2 className="mb-3 text-lg font-medium">Author</h2>
            <LotAuthor name={user?.name} avatarUrl={user?.avatar_url} />
        </aside>
    );
};
