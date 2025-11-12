import "react";

declare module "react" {
    interface FunctionComponent<P = {}> {
        layout?: (page: React.ReactNode) => React.ReactNode;
    }
}
