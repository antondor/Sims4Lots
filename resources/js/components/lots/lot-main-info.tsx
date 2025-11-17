import React from "react";
import type { Lot } from "@/types/lots";
import { Badge } from "@/components/ui/badge";
import { LotSpecsGrid, SpecItem } from "@/components/lots/lot-specs";

type Props = {
    lot: Lot;
};

export const LotMainInfo: React.FC<Props> = ({ lot }) => {
    return (
        <>
            {lot.description && (
                <section className="rounded-xl border p-4 md:p-5">
                    <h2 className="mb-2 text-lg font-medium">Description</h2>
                    <p className="whitespace-pre-line text-muted-foreground">
                        {lot.description}
                    </p>
                </section>
            )}

            <section className="rounded-xl border p-4 md:p-5">
                <h2 className="mb-3 text-lg font-medium">Details</h2>
                <LotSpecsGrid>
                    <SpecItem label="Lot size" value={lot.lot_size} />
                    <SpecItem label="Content" value={lot.content_type} />
                    <SpecItem label="Furnishing" value={lot.furnishing} />
                    <SpecItem label="Type" value={lot.lot_type} />
                    <SpecItem label="Bedrooms" value={lot.bedrooms ?? "—"} />
                    <SpecItem label="Bathrooms" value={lot.bathrooms ?? "—"} />
                </LotSpecsGrid>
            </section>

            {(lot.creator_id || lot.creator_link) && (
                <section className="rounded-xl border p-4 md:p-5">
                    <h2 className="mb-3 text-lg font-medium">Creator</h2>
                    <div className="flex flex-wrap items-center gap-3">
                        {lot.creator_id && (
                            <Badge variant="secondary">{lot.creator_id}</Badge>
                        )}
                        {lot.creator_link && (
                            <a
                                href={lot.creator_link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-primary underline underline-offset-4"
                            >
                                Gallery link
                            </a>
                        )}
                    </div>
                </section>
            )}
        </>
    );
};
