import * as React from "react";
import { toast } from "sonner";

type Props = { children: React.ReactNode; name?: string };
type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(err: any) {
        toast.error(this.props.name ? `${this.props.name} failed` : "Something went wrong");
        console.error(err);
    }

    render() {
        if (this.state.hasError) return null;
        return this.props.children;
    }
}
