import { Check, X, Trophy } from 'lucide-react';

interface ComparisonOption {
    name: string;
    isRecommended?: boolean;
    features: string[];
    bestFor: string;
}

interface ComparisonCardsProps {
    options: [ComparisonOption, ComparisonOption];
}

const ComparisonCards = ({ options }: ComparisonCardsProps) => {
    return (
        <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {options.map((option, index) => (
                <div
                    key={index}
                    className={`relative rounded-xl overflow-hidden border bg-white shadow-sm flex flex-col ${option.isRecommended ? 'border-[#1B4D3E] ring-1 ring-[#1B4D3E]/10' : 'border-gray-200'}`}
                >
                    {option.isRecommended && (
                        <div className="absolute top-0 right-0 bg-[#F5A623] text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10 flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            WINNER
                        </div>
                    )}

                    <div className={`h-2 w-full ${option.isRecommended ? 'bg-[#1B4D3E]' : 'bg-gray-300'}`}></div>

                    <div className="p-6 flex-grow flex flex-col">
                        <h3 className="font-serif font-bold text-xl text-neutral-dark mb-4 text-center">
                            {option.name}
                        </h3>

                        <ul className="space-y-3 mb-8 flex-grow">
                            {option.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                                    {/* Simple detection of "pros/cons" in feature text via +/- or just bullets */}
                                    <div className="mt-0.5 min-w-[16px]">
                                        {feature.startsWith('-') ? (
                                            <X className="w-4 h-4 text-red-500" />
                                        ) : (
                                            <Check className="w-4 h-4 text-[#1B4D3E]" />
                                        )}
                                    </div>
                                    <span>{feature.replace(/^[+-]\s*/, '')}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-auto pt-4 border-t border-gray-100 text-center">
                            <span className="text-xs uppercase tracking-wide text-gray-400 font-bold block mb-1">Best For</span>
                            <p className="font-bold text-[#1B4D3E] text-sm">
                                {option.bestFor}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ComparisonCards;
