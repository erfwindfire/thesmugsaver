const RegistrationCTA = () => {
    return (
        <section className="bg-emerald-900 py-10">
            <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="max-w-lg">
                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">Free Weekly Tips</p>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-white leading-tight">
                        Join 12,000+ smart savers
                    </h2>
                    <p className="text-white/70 text-sm md:text-base mt-2">
                        Real UK money advice — energy bills, savings, benefits, and everyday costs. No jargon, no fluff, no ads.
                    </p>
                </div>
                <div className="md:min-w-[300px] flex-shrink-0">
                    <form className="flex flex-col gap-3" action="#">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
                        />
                        <button
                            type="submit"
                            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-6 rounded-lg transition-colors text-sm shadow-lg shadow-emerald-900/40"
                        >
                            Get regular money saving tips →
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default RegistrationCTA;
