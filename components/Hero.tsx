'use client';

import Image from 'next/image';

const Hero = () => {
    return (
        <section className="relative w-full overflow-hidden bg-accent/10">
            {/* Background with orange theme */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-[#FF7E5F] opacity-90"></div>

            {/* Abstract Background Decoration */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute right-0 top-0 h-full w-1/2 bg-white/20 transform -skew-x-12"></div>
            </div>

            <div className="container relative mx-auto px-4 py-20 lg:py-28 flex flex-col items-center text-center">
                {/* Animated floating logo */}
                <div className="logo-float mb-4">
                    <Image
                        src="/logo.png"
                        alt="The Smug Saver"
                        width={130}
                        height={130}
                        priority
                        className="drop-shadow-xl"
                    />
                </div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4 leading-tight max-w-3xl drop-shadow-sm">
                    The Smug Saver
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-xl font-medium">
                    Independent UK money-saving tips, deals, and financial guidance — updated weekly.
                </p>
            </div>
        </section>
    );
};

export default Hero;
