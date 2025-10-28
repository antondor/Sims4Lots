import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

export const ProjectCard = () => {
    return (
        <Card className="w-95 h-125">
            <CardHeader className="overflow-hidden flex justify-center">
                <CardTitle className="flex items-center gap-2">
                    <img
                        src="/images/dasdasdsa.jpg"
                        alt="123"
                    />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm mb-1">
                    Something: <span>333333</span>
                </p>
                <p className="text-sm mb-1">
                    Something else:{" "}
                    <span>
                        21212312332
                    </span>
                </p>
            </CardContent>
        </Card>
    )
}
