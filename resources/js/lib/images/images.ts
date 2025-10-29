export const isAbsoluteUrl = (u?: string | null): u is string =>
    !!u && /^https?:\/\//i.test(u);

export const toStorageUrl = (u: string) =>
    u.startsWith("/storage") ? u : `/storage/${u}`;

export const resolveSrc = (u?: string | null): string | undefined => {
    if (!u) return undefined;
    return isAbsoluteUrl(u) ? u : toStorageUrl(u);
};

export const AVATAR_PLACEHOLDER = "/images/profile_avatar_placeholder.png";
export const IMAGE_PLACEHOLDER  = "/images/profile_avatar_placeholder.png";
