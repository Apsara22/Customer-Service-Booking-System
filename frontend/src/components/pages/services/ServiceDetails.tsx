
// components/pages/services/ServiceDetails.tsx

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaArrowLeft,
  FaClock,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

import {
  getServiceById,
} from "../../../api/services/serviceApi";

import type {
  Service,
} from "../../../types/service";

import PageBackground from "../../../components/PageBackground";

const ServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  // =========================================
  // STATE
  // =========================================

  const [service, setService] =
    useState<Service | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // =========================================
  // FETCH SERVICE
  // =========================================

  const loadService = async () => {
    if (!serviceId) {
      setError("Service ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getServiceById(serviceId);

      setService(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load service."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadService();
  }, [serviceId]);

  // =========================================
  // LOADING STATE
  // =========================================

  if (loading) {
    return (
      <>
        <PageBackground />

        <section className="relative z-10 min-h-screen px-4 py-10 flex items-center justify-center">

          <div className="text-center">

            <div
              className="
                w-12
                h-12
                mx-auto
                border-4
                border-white/20
                border-t-purple-500
                rounded-full
                animate-spin
              "
            />

            <p className="mt-5 text-white/60">
              Loading service details...
            </p>

          </div>

        </section>
      </>
    );
  }

  // =========================================
  // ERROR / SERVICE NOT FOUND
  // =========================================

  if (error || !service) {
    return (
      <>
        <PageBackground />

        <section className="relative z-10 min-h-screen px-4 py-10 flex items-center justify-center">

          <div className="w-full max-w-lg text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">

            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">

              <FaExclamationTriangle className="text-red-400 text-2xl" />

            </div>

            <h1 className="mt-5 text-2xl font-bold text-white">
              Service Not Found
            </h1>

            <p className="mt-3 text-white/60">
              {error ||
                "The service you are looking for does not exist."}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">

              <button
                type="button"
                onClick={loadService}
                className="
                  px-6
                  py-3
                  rounded-lg
                  bg-gradient-to-r
                  from-purple-600
                  to-pink-600
                  text-white
                  font-semibold
                  hover:opacity-90
                  transition
                "
              >
                Try Again
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    service?.categoryId
                      ? `/services/${service.categoryId}`
                      : "/services"
                  )
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-6
                  py-3
                  rounded-lg
                  bg-white/10
                  border
                  border-white/20
                  text-white
                  hover:bg-white/20
                  transition
                "
              >
                <FaArrowLeft />
                Back to Services
              </button>

            </div>

          </div>

        </section>
      </>
    );
  }

  // =========================================
  // VIEW SERVICE DETAILS
  // =========================================

  return (
    <>
      <PageBackground />

      <section className="relative z-10 min-h-screen px-4 sm:px-6 py-8">

        <div className="max-w-4xl mx-auto">

          {/* ========================================= */}
          {/* BACK BUTTON */}
          {/* ========================================= */}

          <button
            type="button"
            onClick={() =>
              navigate(
                `/services/${service.categoryId}`
              )
            }
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              text-white/60
              hover:text-white
              transition
              mb-6
            "
          >
            <FaArrowLeft />
            Back to Services
          </button>

          {/* ========================================= */}
          {/* SERVICE CARD */}
          {/* ========================================= */}

          <div
            className="
              bg-white/10
              backdrop-blur-xl
              border
              border-white/20
              rounded-2xl
              p-6
              sm:p-8
              shadow-xl
            "
          >

            {/* ========================================= */}
            {/* HEADER */}
            {/* ========================================= */}

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

              <div>

                <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/20 text-purple-300 text-xs font-medium">
                  Service Details
                </span>

                <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-white">
                  {service.name}
                </h1>

                <p className="mt-3 text-white/60 leading-7">
                  {service.description}
                </p>

              </div>

              {/* Availability */}

              <span
                className={`
                  shrink-0
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-3
                  py-2
                  rounded-full
                  text-sm
                  font-medium
                  ${
                    service.isAvailable
                      ? "bg-green-500/15 text-green-400 border border-green-400/20"
                      : "bg-red-500/15 text-red-400 border border-red-400/20"
                  }
                `}
              >
                {service.isAvailable ? (
                  <>
                    <FaCheckCircle />
                    Available
                  </>
                ) : (
                  <>
                    <FaTimesCircle />
                    Unavailable
                  </>
                )}
              </span>

            </div>

            {/* ========================================= */}
            {/* SERVICE INFORMATION */}
            {/* ========================================= */}

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Price */}

              <div
                className="
                  bg-white/10
                  border
                  border-white/10
                  rounded-xl
                  p-5
                "
              >

                <div className="flex items-center gap-2 text-white/40">

                  <FaMoneyBillWave />

                  <span className="text-sm">
                    Price
                  </span>

                </div>

                <p className="mt-2 text-2xl font-bold text-white">
                  Rs. {service.price.toLocaleString()}
                </p>

              </div>

              {/* Duration */}

              <div
                className="
                  bg-white/10
                  border
                  border-white/10
                  rounded-xl
                  p-5
                "
              >

                <div className="flex items-center gap-2 text-white/40">

                  <FaClock />

                  <span className="text-sm">
                    Duration
                  </span>

                </div>

                <p className="mt-2 text-2xl font-bold text-white">
                  {service.duration} minutes
                </p>

              </div>

            </div>

            {/* ========================================= */}
            {/* BOOKING INFORMATION */}
            {/* ========================================= */}

            <div className="mt-8 p-5 rounded-xl bg-purple-500/10 border border-purple-400/20">

              <h2 className="text-lg font-semibold text-white">
                Ready to book?
              </h2>

              <p className="mt-2 text-sm text-white/60">
                Select your preferred date and time to
                continue with the booking.
              </p>

            </div>

            {/* ========================================= */}
            {/* BOOK BUTTON */}
            {/* ========================================= */}

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
                py-3.5
                rounded-lg
                text-white
                font-semibold
                transition-all
                ${
                  service.isAvailable
                    ? `
                      bg-gradient-to-r
                      from-purple-600
                      to-pink-600
                      hover:from-purple-700
                      hover:to-pink-700
                      hover:shadow-lg
                      hover:shadow-purple-500/20
                    `
                    : `
                      bg-gray-600/50
                      text-white/40
                      cursor-not-allowed
                    `
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

