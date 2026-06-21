import JobSection from "../components/home/JobSection";

const Jobs = () => {
    return (
        <div className="font-poppins min-h-screen flex flex-col">
            <div className="flex-grow">
                <JobSection className="pt-20 pb-16" showBack={true} />
            </div>
        </div>
    );
};

export default Jobs;
