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
    download_link?: string | null;
    lot_size: LotSize;
    content_type: ContentType;
    furnishing: Furnishing;
    lot_type: LotType;
    bedrooms: number | null;
    bathrooms: number | null;
    created_at: string;
    updated_at: string;
    user?: { id: number; name: string; avatar?: string | null; avatar_url?: string };
    images?: LotImage[];
    cover_image?: LotImage | null;
}

export type LotImage = {
    id: number;
    url: string;
    position: number;
    is_cover?: boolean;
};

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

export type Enums = {
    lot_sizes: string[];
    content_types: string[];
    furnishings: string[];
    lot_types: string[];
};

export type FormType = {
    name: string;
    description: string | null;
    creator_id: string | null;
    creator_link: string | null;
    download_link: string | null;
    lot_size: string;
    content_type: string;
    furnishing: string;
    lot_type: string;
    bedrooms: number | string;
    bathrooms: number | string;
    images: File[];
};
