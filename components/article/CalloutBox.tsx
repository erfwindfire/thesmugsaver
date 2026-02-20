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
            border: 'border-l-[#C5A065]', // Gold/Bronze
            bg: 'bg-[#F9F9F7]', // Warm Off-White/Beige
            icon: null, // Removed icon for this specific "Breaking News" look or keep subtle
            titleColor: 'text-gray-900 font-serif italic', // Serif Italic Title
            defaultTitle: 'Breaking News',
            containerRunningClass: 'shadow-sm' // subtle shadow
        },
        warning: {
            border: 'border-l-amber-600',
            bg: 'bg-amber-50',
            icon: <AlertTriangle className="w-6 h-6 text-gray-500" />,
            titleColor: 'text-amber-900',
            defaultTitle: 'Warning',
            containerRunningClass: 'shadow-sm'
        },
        tip: {
            border: 'border-l-[#385F5E]', // Branding Teal
            bg: 'bg-[#EBF2F1]',
            icon: <CheckCircle2 className="w-6 h-6 text-gray-500" />,
            titleColor: 'text-[#1B4D3E]',
            defaultTitle: 'Good News',
            containerRunningClass: 'shadow-sm'
        },
        'pro-tip': {
            border: 'border-l-indigo-500',
            bg: 'bg-indigo-50',
            icon: <Lightbulb className="w-6 h-6 text-gray-500" />,
            titleColor: 'text-indigo-900',
            defaultTitle: 'Pro Tip',
            containerRunningClass: 'shadow-sm'
        },
        note: {
            border: 'border-none',
            bg: 'bg-gray-50',
            icon: <Info className="w-6 h-6 text-gray-500" />,
            titleColor: 'text-gray-800',
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
