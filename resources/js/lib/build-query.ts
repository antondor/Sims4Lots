export function buildQuery(params: Record<string, unknown>): string {
    const qp = new URLSearchParams();

    Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "" || v === "Any") return;

        if (Array.isArray(v)) {
            if (!v.length) return;
            v.forEach((val) => qp.append(`${k}[]`, String(val)));
        } else {
            qp.set(k, String(v));
        }
    });

    const s = qp.toString();
    return s ? `?${s}` : "";
}
