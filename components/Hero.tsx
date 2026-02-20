import Link from 'next/link';

const Hero = () => {
    return (
        <section className="relative w-full overflow-hidden bg-accent/10">
            {/* Background with orange theme */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-[#FF7E5F] opacity-90"></div>

            {/* Abstract Background Decoration (Simulating image) */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute right-0 top-0 h-full w-1/2 bg-white/20 transform -skew-x-12"></div>
            </div>

            <div className="container relative mx-auto px-4 py-20 lg:py-32 flex flex-col items-center text-center">
                <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl drop-shadow-sm">
                    Save Smarter, Live Better
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl font-medium">
                    Get personalised money-saving tips, budgeting strategies, and financial advice delivered daily. Build wealth while living well.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                    <Link
                        href="/articles"
                        className="flex-1 bg-white text-accent font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-gray-50 transition-all transform hover:-translate-y-1 text-center"
                    >
                        Start Saving
                    </Link>
                    <Link
                        href="/newsletter"
                        className="flex-1 bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white/10 transition-all text-center"
                    >
                        Join Newsletter
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
