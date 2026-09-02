
import { serviceCategories } from "../../../data/serviceCategories";

const ServiceCategories = () => {
  return (
    <section className="relative z-10 min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Our Services
          </h1>

          <p className="text-white/60 mt-3">
            Choose a service category to get started
          </p>
        </div>

        {/* Service Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((category) => {
            const Icon = category.icon;

            return (
              <div
                key={category.id}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:bg-white/15 hover:border-purple-400/50 transition-all duration-300 cursor-pointer"
              >
                {/* Icon */}
                <div className="text-5xl mb-4 text-purple-400">
                  <Icon className="w-12 h-12" />
                </div>

                {/* Category Name */}
                <h2 className="text-xl font-semibold text-white mb-2">
                  {category.name}
                </h2>

                {/* Description */}
                <p className="text-white/60 text-sm">
                  {category.description}
                </p>

                {/* Button */}
                <button
                  type="button"
                  className="mt-5 w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  View Services
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ServiceCategories;

