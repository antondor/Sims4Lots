import type { User } from "@/types";

export type LotSize = "20x15" | "30x20" | "40x30" | "50x50" | "64x64";
export type ContentType = "CC" | "NoCC";
export type Furnishing = "Furnished" | "Unfurnished";
export type LotType = "Residential" | "Community";

export interface Lot {
    id: number;
    user_id: number;
    name: string;
    description: string | null;
    creator_id: string;
    creator_link: string | null;
    lot_size: LotSize;
    content_type: ContentType;
    furnishing: Furnishing;
    lot_type: LotType;
    bedrooms: number | null;   // tinyint nullable
    bathrooms: number | null;  // tinyint nullable
    created_at: string; // ISO datetime
    updated_at: string; // ISO datetime
    images?: LotImage[];
    user?: User;
}

export interface LotImage {
    id: number;
    lot_id: number;
    url: string;
    position: number;  // unsigned int, default 0
    created_at: string; // ISO datetime
    updated_at: string; // ISO datetime
}

export interface LotsFiltersInterface {
    query?: string;
    lot_type?: LotType | "Any";
    lot_size?: LotSize | "Any";
    furnishing?: Furnishing | "Any";
    content_type?: ContentType | "Any";
    bedroomsMin?: number;
    bedroomsMax?: number;
    bathroomsMin?: number;
    bathroomsMax?: number;
    user_id?: number;
    is_closed?: 0 | 1 | "Any";
}
