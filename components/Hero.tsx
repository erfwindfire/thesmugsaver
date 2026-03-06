const Hero = () => {
    return (
        <section className="relative w-full overflow-hidden bg-emerald-900">
            {/* Subtle diagonal decoration */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute right-0 top-0 h-full w-1/2 bg-white transform -skew-x-12"></div>
            </div>

            <div className="container relative mx-auto px-4 py-10 md:py-14">
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">The UK&apos;s Sharpest Money-Saving Resource</p>
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                    The system isn&apos;t on your side.<br className="hidden md:block" />
                    <span className="text-emerald-400">We are.</span>
                </h1>
                <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-xl">
                    Real UK money advice — energy bills, savings, benefits, and everyday costs. No jargon, no fluff, no ads.
                </p>
            </div>
        </section>
    );
};

export default Hero;
