interface TimelineItem {
    date: string;
    title: string;
    description: string;
}

interface TimelineProps {
    items: TimelineItem[];
}

const Timeline = ({ items }: TimelineProps) => {
    return (
        <div className="my-10">
            <div className="relative ml-3 md:ml-6 space-y-10">
                {items.map((item, index) => (
                    <div key={index} className="relative pl-8 md:pl-12">
                        {/* Dot */}
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-[#1B4D3E]"></div>

                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 mb-2">
                            <span className="font-bold text-[#1B4D3E] text-sm tracking-wide uppercase whitespace-nowrap">
                                {item.date}
                            </span>
                            <h4 className="font-serif font-bold text-lg text-neutral-dark">
                                {item.title}
                            </h4>
                        </div>

                        <p className="text-gray-600">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Timeline;
