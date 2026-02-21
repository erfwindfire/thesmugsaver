interface TldrBoxProps {
    summary: string;
    actions?: string[];
}

const TldrBox = ({ summary, actions }: TldrBoxProps) => {
    const hasRealSummary = summary && summary.trim().length > 0;

    return (
        <div className="not-prose my-10 rounded-lg overflow-hidden border-l-4 border-[#1B4D3E] bg-[#EBF2F1] shadow-sm max-w-[720px] mx-auto">
            <div className="p-8">
                <div className="text-sm font-bold uppercase tracking-widest text-[#1B4D3E]/70 border-b-2 border-[#1B4D3E]/20 pb-1 mb-4 inline-block">
                    Key Points
                </div>

                {hasRealSummary && (
                    <div className="mb-4 text-gray-800 leading-relaxed font-medium">
                        <strong className="text-neutral-dark">Bottom Line:</strong> {summary}
                    </div>
                )}

                {actions && actions.length > 0 && (
                    <div className={`space-y-2 ${hasRealSummary ? 'mt-4 pt-4 border-t border-[#1B4D3E]/20' : ''}`}>
                        {actions.map((action, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="mt-0.5 min-w-[16px] text-[#1B4D3E] font-bold text-base leading-tight select-none">✓</span>
                                <span>{action}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TldrBox;
