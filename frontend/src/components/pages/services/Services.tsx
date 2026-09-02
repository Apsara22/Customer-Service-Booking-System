import { useNavigate, useParams } from "react-router-dom";
import { services, serviceCategories } from "../../../data/serviceCategories";
import PageBackground from "../../../components/PageBackground";

const Services = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  // Find selected category
  const category = serviceCategories.find(
    (item) => item.id === categoryId
  );

  // Find services belonging to selected category
  const categoryServices = services.filter(
    (service) => service.categoryId === categoryId
  );

  // Category not found
  if (!category) {
    return (
      <>
        <PageBackground />

        <section className="relative z-10 min-h-screen p-6 flex items-center justify-center">
          <div className="text-center">

            <h1 className="text-3xl font-bold text-white">
              Category Not Found
            </h1>

            <button
              type="button"
              onClick={() => navigate("/services")}
              className="mt-5 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
            >
              Back to Services
            </button>

          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageBackground />

      <section className="relative z-10 min-h-screen px-6 py-10">

        <div className="max-w-7xl mx-auto">

          {/* ========================================= */}
          {/* CATEGORY HEADER */}
          {/* ========================================= */}

          <div className="text-center mb-10">

            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {category.name}
            </h1>

            <p className="mt-3 text-white/60">
              {category.description}
            </p>

            <p className="mt-2 text-sm text-white/40">
              Choose a service to continue
            </p>

          </div>


          {/* ========================================= */}
          {/* SERVICES */}
          {/* ========================================= */}

          {categoryServices.length === 0 ? (

            <div className="text-center py-20">

              <h2 className="text-2xl font-semibold text-white">
                No Services Available
              </h2>

              <p className="mt-2 text-white/50">
                There are currently no services available
                in this category.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {categoryServices.map((service) => (

                <div
                  key={service.id}
                  className="
                    bg-white/10
                    backdrop-blur-xl
                    border border-white/20
                    rounded-2xl
                    p-6
                    shadow-xl
                    hover:bg-white/15
                    hover:border-purple-400/50
                    transition-all
                    duration-300
                  "
                >

                  {/* Service Name */}

                  <h2 className="text-xl font-semibold text-white">
                    {service.name}
                  </h2>


                  {/* Description */}

                  <p className="mt-3 text-sm text-white/60 min-h-[48px]">
                    {service.description}
                  </p>


                  {/* Price & Duration */}

                  <div className="grid grid-cols-2 gap-3 mt-6">

                    <div className="bg-white/10 rounded-lg p-3">

                      <p className="text-xs text-white/40">
                        Price
                      </p>

                      <p className="mt-1 text-white font-semibold">
                        Rs. {service.price}
                      </p>

                    </div>


                    <div className="bg-white/10 rounded-lg p-3">

                      <p className="text-xs text-white/40">
                        Duration
                      </p>

                      <p className="mt-1 text-white font-semibold">
                        {service.duration} min
                      </p>

                    </div>

                  </div>


                  {/* View Details */}

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/services/${service.categoryId}/${service.id}`
                      )
                    }
                    className="
                      mt-6
                      w-full
                      py-3
                      rounded-lg
                      bg-gradient-to-r
                      from-purple-600
                      to-pink-600
                      text-white
                      font-semibold
                      hover:from-purple-700
                      hover:to-pink-700
                      transition-all
                    "
                  >
                    View Details
                  </button>

                </div>

              ))}

            </div>

          )}

        </div>

      </section>
    </>
  );
};

export default Services;