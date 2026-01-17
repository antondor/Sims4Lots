import React from "react";
import type { Lot } from "@/types/lots";
import { LotSpecsGrid, SpecItem } from "@/components/lots/lot-specs";
import {LotAuthor} from "@/components/lots/lot-author";

type Props = {
    lot: Lot;
};

export const LotDetailsAside: React.FC<Props> = ({ lot }) => {
    return (
        <aside className="rounded-xl border p-4 md:p-5 h-fit">
            <LotAuthor name={lot.user?.name} avatarUrl={lot.user?.avatar_url} />

            <div className="space-y-3 mt-4">
                <SpecItem label="Lot size" value={lot.lot_size} />
                <SpecItem label="Content" value={lot.content_type} />
                <SpecItem label="Furnishing" value={lot.furnishing} />
                <SpecItem label="Type" value={lot.lot_type} />
                {lot.bedrooms !== null ? <SpecItem label="Bedrooms" value={lot.bedrooms} /> : null}
                {lot.bedrooms !== null ? <SpecItem label="Bathrooms" value={lot.bathrooms} /> : null}
            </div>
        </aside>
    );
};
