import * as React from "react";

const MOBILE_WIDTH = 768;

export function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState<boolean>(() => {
        if (typeof window === "undefined") return false;
        return window.innerWidth < MOBILE_WIDTH;
    });

    React.useEffect(() => {
        if (typeof window === "undefined") return;

        const onResize = () => {
            setIsMobile(window.innerWidth < MOBILE_WIDTH);
        };

        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    return isMobile;
}
