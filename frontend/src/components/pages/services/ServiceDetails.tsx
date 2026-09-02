import { useParams, useNavigate } from "react-router-dom";
import { services } from "../../../data/serviceCategories";
import PageBackground from "../../../components/PageBackground";

const ServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const service = services.find(
    (item) => item.id === serviceId
  );

  if (!service) {
    return (
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-center">

          <h1 className="text-2xl font-bold text-white">
            Service Not Found
          </h1>

          <button
            type="button"
            onClick={() => navigate("/services")}
            className="mt-4 px-5 py-2 bg-purple-600 text-white rounded-lg"
          >
            Back to Services
          </button>

        </div>
      </div>
    );
  }

  return (
    <>
      <PageBackground />

      <section className="relative z-10 min-h-screen p-6">

        <div className="max-w-4xl mx-auto">

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">

            <h1 className="text-3xl font-bold text-white">
              {service.name}
            </h1>

            <p className="mt-4 text-white/60">
              {service.description}
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* Price */}
              <div className="bg-white/10 rounded-lg p-4">

                <p className="text-white/50 text-sm">
                  Price
                </p>

                <p className="text-white text-xl font-semibold">
                  Rs. {service.price}
                </p>

              </div>

              {/* Duration */}
              <div className="bg-white/10 rounded-lg p-4">

                <p className="text-white/50 text-sm">
                  Duration
                </p>

                <p className="text-white text-xl font-semibold">
                  {service.duration} minutes
                </p>

              </div>

              {/* Availability */}
              <div className="bg-white/10 rounded-lg p-4">

                <p className="text-white/50 text-sm">
                  Availability
                </p>

                <p
                  className={`text-xl font-semibold ${
                    service.isAvailable
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {service.isAvailable
                    ? "Available"
                    : "Unavailable"}
                </p>

              </div>

            </div>

            {/* Booking Button */}
            <button
              type="button"
              disabled={!service.isAvailable}
              onClick={() =>
                navigate(
                  `/services/${service.categoryId}/${service.id}/booking`
                )
              }
              className={`
                mt-8
                w-full
                py-3
                text-white
                font-semibold
                rounded-lg
                transition
                ${
                  service.isAvailable
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
                    : "bg-gray-600 cursor-not-allowed opacity-60"
                }
              `}
            >
              {service.isAvailable
                ? "Book This Service"
                : "Service Unavailable"}
            </button>

          </div>

        </div>

      </section>
    </>
  );
};

export default ServiceDetails;