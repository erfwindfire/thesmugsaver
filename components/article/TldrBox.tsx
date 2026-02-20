import { Check } from 'lucide-react';

interface TldrBoxProps {
    summary: string;
    actions?: string[];
}

const TldrBox = ({ summary, actions }: TldrBoxProps) => {
    return (
        <div className="not-prose my-10 rounded-lg overflow-hidden border-l-4 border-[#1B4D3E] bg-[#EBF2F1] shadow-sm max-w-[720px] mx-auto">
            <div className="p-8">
                <h3 className="font-serif font-bold text-xl text-[#1B4D3E] mb-4 flex items-center gap-3">
                    <span className="text-sm font-bold uppercase tracking-widest text-[#1B4D3E]/70 border-b-2 border-[#1B4D3E]/20 pb-1">Key Takeaways</span>
                </h3>

                <div className="mb-4 text-gray-800 leading-relaxed font-medium">
                    <strong className="text-neutral-dark">Bottom Line:</strong> {summary}
                </div>

                {actions && actions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-amber-200/50">
                        <h4 className="font-bold text-sm text-amber-700 uppercase tracking-wide mb-3">Key Actions:</h4>
                        <ul className="space-y-2 list-none">
                            {actions.map((action, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                    <div className="mt-0.5 min-w-[16px]">
                                        <Check className="w-4 h-4 text-gray-500 font-bold" strokeWidth={3} />
                                    </div>
                                    <span>{action}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TldrBox;
