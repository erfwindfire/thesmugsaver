const NewsletterSection = () => {
    return (
        <section className="bg-primary py-16 md:py-24">
            <div className="container mx-auto px-4 text-center">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                    Smart Money Management
                </h2>
                <p className="text-primary-light/90 mb-8 max-w-2xl mx-auto text-lg">
                    Get personalised money-saving tips, budgeting strategies, and financial advice delivered daily. Build wealth while living well.
                </p>

                <form className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        className="flex-grow px-5 py-3 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-secondary hover:bg-secondary-hover text-white font-bold py-3 px-6 rounded-md transition-colors shadow-sm"
                    >
                        Subscribe now to start saving
                    </button>
                </form>
            </div>
        </section>
    );
};

export default NewsletterSection;
