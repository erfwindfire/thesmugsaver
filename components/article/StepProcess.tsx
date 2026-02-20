interface StepProcessProps {
    steps: {
        title: string;
        description: string;
    }[];
}

const StepProcess = ({ steps }: StepProcessProps) => {
    return (
        <div className="my-12 space-y-8">
            {steps.map((step, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                    <h3 className="font-serif font-bold text-xl text-neutral-dark mb-4 flex items-center gap-3">
                        <span className="text-[#C5A065] uppercase tracking-widest text-sm font-bold">
                            {index + 1}. {step.title.toUpperCase()}
                        </span>
                    </h3>
                    {/* If title was just the number/label, we might want a separate title line, but based on image "1. THE £250 HARD CAP", it's integrated */}

                    <div
                        className="text-gray-700 leading-relaxed text-lg"
                        dangerouslySetInnerHTML={{ __html: step.description }}
                    />
                </div>
            ))}
        </div>
    );
};

export default StepProcess;
