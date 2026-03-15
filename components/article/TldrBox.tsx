import { Check } from 'lucide-react';

interface TldrBoxProps {
    summary?: string;
    actions?: string[];
}

const TldrBox = ({ summary, actions }: TldrBoxProps) => {
    return (
        <div className="not-prose my-10 max-w-[720px] mx-auto" style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8E8E8',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
            padding: '36px 40px'
        }}>
            <h3 style={{
                color: '#B8962E',
                fontFamily: "'Playfair Display', serif",
                fontSize: '15px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                marginBottom: '16px',
                marginTop: 0,
                textTransform: 'uppercase'
            }}>
                Key Takeaways
            </h3>

            {summary && summary.trim() && (
                <div style={{
                    color: '#333333',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '16px',
                    lineHeight: 1.75,
                    fontWeight: 400,
                    marginBottom: actions && actions.length > 0 ? '20px' : 0
                }}>
                    <strong style={{ fontWeight: 600 }}>Bottom Line:</strong> {summary}
                </div>
            )}

            {actions && actions.length > 0 && (
                <div style={{
                    borderTop: '1px solid #E8E8E8',
                    paddingTop: '20px'
                }}>
                    <h4 style={{
                        color: '#B8962E',
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '13px',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        marginBottom: '14px',
                        marginTop: 0
                    }}>
                        Key Actions
                    </h4>
                    <ul className="space-y-2 !list-none" style={{ margin: 0, padding: 0 }}>
                        {actions.map((action, index) => (
                            <li key={index} className="flex items-start gap-2 !pl-0 before:!content-none" style={{
                                color: '#333333',
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '15px',
                                lineHeight: 1.7
                            }}>
                                <div style={{ marginTop: '3px', minWidth: '16px' }}>
                                    <Check className="w-4 h-4" style={{ color: '#B8962E' }} strokeWidth={3} />
                                </div>
                                <span>{action}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TldrBox;
