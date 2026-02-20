import type { User } from "@/types";
import { LOT_SIZES, CONTENT_TYPES, FURNISHINGS, LOT_TYPES, LOT_STATUSES } from "@/constants/lots";

export type LotSize = typeof LOT_SIZES[number];
export type ContentType = typeof CONTENT_TYPES[number];
export type Furnishing = typeof FURNISHINGS[number];
export type LotType = typeof LOT_TYPES[number];
export type LotStatus = typeof LOT_STATUSES[number];

export type LotImage = {
    id: number;
    url: string;
    position: number;
    is_cover?: boolean;
};

export type PreviewUser = { id: number; name: string; avatar?: string | null; avatar_url?: string | null };

export interface Lot {
    id: number;
    user_id: number;
    name: string;
    description: string | null;
    creator_link: string | null;
    download_link?: string | null;
    gallery_id?: string | null;
    lot_size: LotSize;
    content_type: ContentType;
    furnishing: Furnishing;
    lot_type: LotType;
    bedrooms: number | null;
    bathrooms: number | null;
    status: LotStatus;
    rejection_reason?: string | null;
    favorites_count?: number;
    created_at: string;
    updated_at: string;
    downloads: number;
    user?: PreviewUser;
    images?: LotImage[];
    cover_image?: LotImage | null;
    is_favorited?: boolean;
    isFavorited?: boolean;
}

export type LotsFilters = {
    lotType?: LotType;
    sizes?: LotSize[];
    contentTypes?: ContentType[];
    furnishings?: Furnishing[];
    bedroomsMin?: number | "";
    bedroomsMax?: number | "";
    bathroomsMin?: number | "";
    bathroomsMax?: number | "";
    query?: string;
    user_id?: number;
};

export type Enums = {
    lot_sizes: readonly string[];
    content_types: readonly string[];
    furnishings: readonly string[];
    lot_types: readonly string[];
};

export type FormType = {
    name: string;
    description: string | null;
    creator_link: string | null;
    download_link: string | null;
    gallery_id: string | null;
    lot_size: LotSize | "";
    content_type: ContentType | "";
    furnishing: Furnishing | "";
    lot_type: LotType | "";
    bedrooms: number | string;
    bathrooms: number | string;
    images: File[];
};
