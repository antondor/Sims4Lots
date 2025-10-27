import {ProjectCard} from "@/components/project-card";

export const DashboardList = () => {
    // const { auth } = usePage<SharedData>().props;

    return (
        <>
            <div className="flex items-center justify-between mb-5">
                <h2 className="mt-2 flex flex-col">
                    <span className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                        123123123
                    </span>
                    3333333333333
                </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
            </div>
        </>
    );
};
