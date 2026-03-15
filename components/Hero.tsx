const Hero = () => {
    return (
        <section className="relative w-full overflow-hidden bg-emerald-900">
            {/* Subtle diagonal decoration */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute right-0 top-0 h-full w-1/2 bg-white transform -skew-x-12"></div>
            </div>

            <div className="container relative mx-auto px-4 py-10 md:py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                {/* Left: tagline */}
                <div className="max-w-xl">
                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">The UK&apos;s Sharpest Money-Saving Resource</p>
                    <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                        The system isn&apos;t on your side.<br className="hidden md:block" />
                        <span className="text-emerald-400">We are.</span>
                    </h1>
                    <p className="text-white/80 text-base md:text-lg leading-relaxed">
                        Real UK money advice — energy bills, savings, benefits, and everyday costs.
                    </p>
                </div>

                {/* Right: email signup */}
                <div className="md:min-w-[320px] flex-shrink-0">
                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">Free Weekly Tips</p>

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

export default Hero;
