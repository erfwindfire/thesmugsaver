import { Mail, Phone, MapPin, Globe } from 'lucide-react';

interface ContactCardProps {
    name: string;
    role: string;
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
    image?: string;
}

const ContactCard = ({ name, role, email, phone, website, address, image }: ContactCardProps) => {
    return (
        <div className="my-10 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-gray-50 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-gray-100">
                <div className="text-center">
                    {image ? (
                        <img src={image} alt={name} className="w-24 h-24 rounded-full mx-auto mb-3 object-cover shadow-sm border-2 border-white" />
                    ) : (
                        <div className="w-24 h-24 rounded-full mx-auto mb-3 bg-[#1B4D3E]/10 flex items-center justify-center text-[#1B4D3E] text-2xl font-bold font-serif">
                            {name.charAt(0)}
                        </div>
                    )}
                    <h3 className="font-serif font-bold text-lg text-neutral-dark">{name}</h3>
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">{role}</p>
                </div>
            </div>

            <div className="flex-grow p-6 flex flex-col justify-center">
                <div className="space-y-4">
                    {email && (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                                <Mail className="w-4 h-4 text-[#1B4D3E]" />
                            </div>
                            <a href={`mailto:${email}`} className="text-gray-700 hover:text-[#1B4D3E] font-medium transition-colors">
                                {email}
                            </a>
                        </div>
                    )}

                    {phone && (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                                <Phone className="w-4 h-4 text-[#1B4D3E]" />
                            </div>
                            <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-gray-700 hover:text-[#1B4D3E] font-medium transition-colors">
                                {phone}
                            </a>
                        </div>
                    )}

                    {website && (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                                <Globe className="w-4 h-4 text-[#1B4D3E]" />
                            </div>
                            <a href={website} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#1B4D3E] font-medium transition-colors">
                                {website.replace(/^https?:\/\//, '')}
                            </a>
                        </div>
                    )}

                    {address && (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-4 h-4 text-[#1B4D3E]" />
                            </div>
                            <span className="text-gray-700">
                                {address}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactCard;
