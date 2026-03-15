import { AlertTriangle, CheckCircle2, Lightbulb, Info } from 'lucide-react';

export type CalloutType = 'important' | 'warning' | 'tip' | 'pro-tip' | 'note';

interface CalloutBoxProps {
    type: CalloutType;
    title?: string;
    children: React.ReactNode;
}

const CalloutBox = ({ type, title, children }: CalloutBoxProps) => {
    const styles = {
        important: {
            border: 'border-l-[#1B4D3E]',
            bg: 'bg-stone-50',
            icon: null,
            titleColor: 'text-stone-900 font-serif italic',
            defaultTitle: 'Breaking News',
            containerRunningClass: 'shadow-sm'
        },
        warning: {
            border: 'border-l-[#1B4D3E]',
            bg: 'bg-[#FAFAF8]',
            icon: <AlertTriangle className="w-6 h-6 text-[#1B4D3E]" />,
            titleColor: 'text-stone-900',
            defaultTitle: 'Warning',
            containerRunningClass: 'shadow-sm'
        },
        tip: {
            border: 'border-l-[#1B4D3E]',
            bg: 'bg-[#EBF2F1]',
            icon: <CheckCircle2 className="w-6 h-6 text-[#1B4D3E]" />,
            titleColor: 'text-[#1B4D3E]',
            defaultTitle: 'Good News',
            containerRunningClass: 'shadow-sm'
        },
        'pro-tip': {
            border: 'border-l-[#1B4D3E]',
            bg: 'bg-slate-50',
            icon: <Lightbulb className="w-6 h-6 text-[#1B4D3E]" />,
            titleColor: 'text-[#1B4D3E]',
            defaultTitle: 'Pro Tip',
            containerRunningClass: 'shadow-sm'
        },
        note: {
            border: 'border-l-[#1B4D3E]',
            bg: 'bg-gray-50',
            icon: <Info className="w-6 h-6 text-[#1B4D3E]" />,
            titleColor: 'text-gray-700',
            defaultTitle: 'Note',
            containerRunningClass: ''
        }
    };

    const style = styles[type] || styles.note;
    const displayTitle = title || style.defaultTitle;

    return (
        <div className={`my-8 p-8 rounded-r-lg border-l-4 ${style.border} ${style.bg} ${style.containerRunningClass} overflow-hidden`}>
            <div className="flex gap-4">
                {style.icon && (
                    <div className="flex-shrink-0 mt-1">
                        {style.icon}
                    </div>
                )}
                <div>
                    <h4 className={`font-bold text-xl mb-3 ${style.titleColor}`}>
                        {displayTitle}
                    </h4>
                    <div className="text-gray-800 leading-loose font-medium font-serif text-lg italic opacity-90">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalloutBox;
