import { ExternalLink, FileText, Link as LinkIcon, Download } from 'lucide-react';
import Link from 'next/link';

interface ResourceLink {
    title: string;
    url: string;
    description?: string;
    type?: 'article' | 'external' | 'download' | 'tool';
}

interface ResourceLinksProps {
    title?: string;
    links: ResourceLink[];
}

const ResourceLinks = ({ title = "Recommended Resources", links }: ResourceLinksProps) => {
    const getIcon = (type?: string, url?: string) => {
        if (type === 'download' || url?.endsWith('.pdf')) return <Download className="w-5 h-5 text-blue-600" />;
        if (type === 'external' || url?.startsWith('http')) return <ExternalLink className="w-5 h-5 text-gray-500" />;
        return <FileText className="w-5 h-5 text-[#1B4D3E]" />;
    };

    return (
        <div className="my-10 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="bg-[#1B4D3E] px-6 py-4">
                <h3 className="text-white font-serif font-bold text-lg flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-white/80" />
                    {title}
                </h3>
            </div>

            <div className="divide-y divide-gray-100">
                {links.map((link, index) => (
                    <div key={index} className="p-4 hover:bg-white transition-colors group">
                        <Link href={link.url} className="flex gap-4 items-start" target={link.url.startsWith('http') ? '_blank' : undefined}>
                            <div className="mt-1 p-2 bg-white rounded-lg border border-gray-100 shadow-sm group-hover:border-[#1B4D3E]/30 transition-colors">
                                {getIcon(link.type, link.url)}
                            </div>
                            <div>
                                <h4 className="font-bold text-neutral-dark group-hover:text-[#1B4D3E] transition-colors">
                                    {link.title}
                                </h4>
                                {link.description && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {link.description}
                                    </p>
                                )}
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResourceLinks;
