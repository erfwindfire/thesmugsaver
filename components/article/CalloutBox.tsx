import { AlertTriangle, CheckCircle2, Lightbulb, Info } from 'lucide-react';

export type CalloutType = 'important' | 'warning' | 'tip' | 'pro-tip' | 'note';

interface CalloutBoxProps {
    type: CalloutType;
    title?: string;
    children: React.ReactNode;
}

const CalloutBox = ({ type, title, children }: CalloutBoxProps) => {
    const config = {
        important: {
            icon: null,
            defaultTitle: 'Breaking News',
        },
        warning: {
            icon: <AlertTriangle className="w-5 h-5" style={{ color: '#B8962E' }} />,
            defaultTitle: 'Warning',
        },
        tip: {
            icon: <CheckCircle2 className="w-5 h-5" style={{ color: '#B8962E' }} />,
            defaultTitle: 'Good News',
        },
        'pro-tip': {
            icon: <Lightbulb className="w-5 h-5" style={{ color: '#B8962E' }} />,
            defaultTitle: 'Tip',
        },
        note: {
            icon: <Info className="w-5 h-5" style={{ color: '#B8962E' }} />,
            defaultTitle: 'Note',
        }
    };

    const { icon, defaultTitle } = config[type] || config.note;
    const displayTitle = title || defaultTitle;

    return (
        <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8E8E8',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
            padding: '28px 32px',
            margin: '32px 0'
        }}>
            <div className="flex gap-3">
                {icon && (
                    <div style={{ marginTop: '2px', flexShrink: 0 }}>
                        {icon}
                    </div>
                )}
                <div>
                    <h4 style={{
                        color: '#B8962E',
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '15px',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        marginBottom: '10px',
                        marginTop: 0
                    }}>
                        {displayTitle}
                    </h4>
                    <div style={{
                        color: '#333333',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '16px',
                        lineHeight: 1.75,
                        fontWeight: 400
                    }}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalloutBox;
