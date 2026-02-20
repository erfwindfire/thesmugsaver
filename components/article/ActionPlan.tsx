import { Target, CheckCircle2, ArrowRight } from 'lucide-react';

interface ActionItem {
    title: string;
    description?: string;
}

interface ActionPlanProps {
    title?: string;
    items: ActionItem[];
}

const ActionPlan = ({ title = "Your Action Plan", items }: ActionPlanProps) => {
    return (
        <div className="my-10 bg-white rounded-xl border-2 border-[#1B4D3E] overflow-hidden shadow-sm">
            <div className="bg-[#1B4D3E] px-6 py-5 flex items-center gap-3">
                <Target className="w-6 h-6 text-white" />
                <h3 className="text-white font-serif font-bold text-xl m-0">{title}</h3>
            </div>

            <div className="p-6 md:p-8 space-y-6">
                {items.map((item, index) => (
                    <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 mt-1">
                            <div className="w-8 h-8 rounded-full bg-[#1B4D3E]/10 flex items-center justify-center text-[#1B4D3E] font-bold">
                                {index + 1}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-neutral-dark mb-1 flex items-center gap-2">
                                {item.title}
                            </h4>
                            <p className="text-gray-600 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end">
                <span className="text-[#1B4D3E] font-bold text-sm uppercase tracking-wide flex items-center gap-1">
                    Take Action <ArrowRight className="w-4 h-4" />
                </span>
            </div>
        </div>
    );
};

export default ActionPlan;
