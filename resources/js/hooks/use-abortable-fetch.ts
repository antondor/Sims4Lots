import * as React from "react";

export function useAbortableFetch() {
    const abortRef = React.useRef<AbortController | null>(null);
    const run = React.useCallback(async (input: RequestInfo, init?: RequestInit) => {
        abortRef.current?.abort();
        const ac = new AbortController();
        abortRef.current = ac;
        const res = await fetch(input, { ...init, signal: ac.signal });
        return { res, aborted: ac.signal.aborted };
    }, []);
    React.useEffect(() => () => abortRef.current?.abort(), []);
    return run;
}
