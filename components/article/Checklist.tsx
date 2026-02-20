import { Check, X, Circle, CheckCircle2 } from 'lucide-react';

interface ChecklistProps {
    items: string[];
}

const Checklist = ({ items }: ChecklistProps) => {
    return (
        <div className="not-prose my-8 rounded-xl bg-white border border-gray-200 p-8 shadow-sm">
            <h4 className="font-bold text-lg mb-6 text-gray-900 flex items-center gap-2">
                <span className="text-gray-900">
                    <CheckCircle2 className="w-6 h-6" />
                </span>
                Action Checklist
            </h4>
            <ul className="space-y-4">
                {items.map((item, index) => (
                    <li key={index} className="flex items-start gap-4">
                        <div className="mt-1 flex-shrink-0 relative">
                            <div className="w-6 h-6 rounded border-2 border-gray-300 flex items-center justify-center bg-white group hover:border-gray-400 transition-colors">
                                {/* Simulated 'checked' state or just empty box ready to check */}
                                {/* For editorial purpose, usually these are empty for user to 'mentally check', or we use check icons if it's a 'what you get' list */}
                                {/* Prompt says: "Styled checkbox UI... not unicode squares" */}
                                <div className="hidden group-hover:block w-3 h-3 bg-gray-400 rounded-sm"></div>
                            </div>
                        </div>
                        <span className="text-gray-800 font-medium leading-relaxed text-lg">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Checklist;
