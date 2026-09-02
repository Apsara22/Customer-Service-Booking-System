

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaSearch,
  FaClock,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";

import {
  serviceCategories,
} from "../../../data/serviceCategories";

import {
  getServices,
} from "../../../api/services/serviceApi";

import type {
  Service,
} from "../../../types/service";

import PageBackground from "../../../components/PageBackground";

const Services = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  // =========================================
  // STATE
  // =========================================

  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    null
  );

  // =========================================
  // FIND SELECTED CATEGORY
  // =========================================

  const category = serviceCategories.find(
    (item) => item.id === categoryId
  );

  // =========================================
  // FETCH SERVICES FROM MOCK API
  // =========================================

  const loadServices = async () => {
    if (!categoryId) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getServices({
        category: categoryId,
      });

      setServices(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load services."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, [categoryId]);

  // =========================================
  // FILTER SERVICES BY SEARCH
  // =========================================

  const filteredServices = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    if (!normalizedSearch) {
      return services;
    }

    return services.filter((service) => {
      return (
        service.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        service.description
          .toLowerCase()
          .includes(normalizedSearch)
      );
    });
  }, [services, searchTerm]);

  // =========================================
  // CATEGORY NOT FOUND
  // =========================================

  if (!category) {
    return (
      <>
        <PageBackground />

        <section className="relative z-10 min-h-screen px-4 py-10 flex items-center justify-center">
          <div className="w-full max-w-lg text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">

            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
              <FaTimesCircle className="text-red-400 text-3xl" />
            </div>

            <h1 className="mt-5 text-3xl font-bold text-white">
              Category Not Found
            </h1>

            <p className="mt-3 text-white/60">
              The service category you are looking for
              does not exist.
            </p>

            <button
              type="button"
              onClick={() => navigate("/services")}
              className="
                mt-6
                inline-flex
                items-center
                gap-2
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
              <FaArrowLeft />
              Back to Categories
            </button>

          </div>
        </section>
      </>
    );
  }

  // =========================================
  // CLEAR SEARCH
  // =========================================

  const clearSearch = () => {
    setSearchTerm("");
  };

  // =========================================
  // LOADING STATE
  // =========================================

  if (loading) {
    return (
      <>
        <PageBackground />

        <section className="relative z-10 min-h-screen px-4 sm:px-6 py-8">

          <div className="max-w-7xl mx-auto">

            <div className="mb-8">

              <button
                type="button"
                onClick={() => navigate("/services")}
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  text-white/60
                  hover:text-white
                  transition
                  mb-5
                "
              >
                <FaArrowLeft />
                Back to Categories
              </button>

              <div className="text-center">

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                  {category.name}
                </h1>

                <p className="mt-3 max-w-2xl mx-auto text-white/60">
                  {category.description}
                </p>

              </div>

            </div>

            <div className="flex flex-col items-center justify-center py-24">

              <div
                className="
                  w-12
                  h-12
                  border-4
                  border-white/20
                  border-t-purple-500
                  rounded-full
                  animate-spin
                "
              />

              <p className="mt-5 text-white/60">
                Loading services...
              </p>

            </div>

          </div>

        </section>
      </>
    );
  }

  // =========================================
  // ERROR STATE
  // =========================================

  if (error) {
    return (
      <>
        <PageBackground />

        <section className="relative z-10 min-h-screen px-4 py-10 flex items-center justify-center">

          <div className="w-full max-w-lg text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">

            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
              <FaExclamationTriangle className="text-red-400 text-2xl" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-white">
              Unable to Load Services
            </h1>

            <p className="mt-3 text-white/60">
              {error}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">

              <button
                type="button"
                onClick={loadServices}
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
                onClick={() => navigate("/services")}
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
                Back to Categories
              </button>

            </div>

          </div>

        </section>
      </>
    );
  }

  // =========================================
  // VIEW SERVICES
  // =========================================

  return (
    <>
      <PageBackground />

      <section className="relative z-10 min-h-screen px-4 sm:px-6 py-8">

        <div className="max-w-7xl mx-auto">

          {/* ========================================= */}
          {/* PAGE HEADER */}
          {/* ========================================= */}

          <div className="mb-8">

            <button
              type="button"
              onClick={() => navigate("/services")}
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                text-white/60
                hover:text-white
                transition
                mb-5
              "
            >
              <FaArrowLeft />
              Back to Categories
            </button>

            <div className="text-center">

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                {category.name}
              </h1>

              <p className="mt-3 max-w-2xl mx-auto text-white/60">
                {category.description}
              </p>

              <p className="mt-2 text-sm text-white/40">
                Choose a service that meets your needs.
              </p>

            </div>

          </div>

          {/* ========================================= */}
          {/* SEARCH */}
          {/* ========================================= */}

          <div className="max-w-2xl mx-auto mb-8">

            <div className="relative">

              <FaSearch
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-white/40
                "
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder={`Search ${category.name.toLowerCase()} services...`}
                aria-label="Search services"
                className="
                  w-full
                  pl-11
                  pr-12
                  py-3
                  bg-white/10
                  backdrop-blur-xl
                  border
                  border-white/20
                  rounded-xl
                  text-white
                  placeholder-white/40
                  outline-none
                  focus:border-purple-400
                  focus:ring-2
                  focus:ring-purple-500/30
                  transition
                "
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-white/40
                    hover:text-white
                    transition
                  "
                >
                  <FaTimes />
                </button>
              )}

            </div>

          </div>

          {/* ========================================= */}
          {/* SERVICE COUNT */}
          {/* ========================================= */}

          <div className="flex items-center justify-between mb-5">

            <p className="text-sm text-white/50">
              {filteredServices.length}{" "}
              {filteredServices.length === 1
                ? "service"
                : "services"}{" "}
              available
            </p>

            {searchTerm && (
              <p className="text-sm text-white/50">
                Search results for{" "}
                <span className="text-white">
                  "{searchTerm}"
                </span>
              </p>
            )}

          </div>

          {/* ========================================= */}
          {/* EMPTY SEARCH RESULT */}
          {/* ========================================= */}

          {filteredServices.length === 0 ? (

            <div className="py-20 text-center">

              <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center">
                <FaSearch className="text-white/40 text-2xl" />
              </div>

              <h2 className="mt-5 text-2xl font-semibold text-white">
                No Services Found
              </h2>

              <p className="mt-2 text-white/50">
                We couldn't find any service matching
                your search.
              </p>

              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="
                    mt-5
                    px-5
                    py-2.5
                    rounded-lg
                    bg-white/10
                    border
                    border-white/20
                    text-white
                    hover:bg-white/20
                    transition
                  "
                >
                  Clear Search
                </button>
              )}

            </div>

          ) : (

            /* ========================================= */
            /* SERVICE GRID */
            /* ========================================= */

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {filteredServices.map((service) => (

                <article
                  key={service.id}
                  className="
                    group
                    flex
                    flex-col
                    bg-white/10
                    backdrop-blur-xl
                    border
                    border-white/20
                    rounded-2xl
                    p-6
                    shadow-xl
                    hover:bg-white/15
                    hover:border-purple-400/50
                    transition-all
                    duration-300
                  "
                >

                  {/* ================================= */}
                  {/* SERVICE HEADER */}
                  {/* ================================= */}

                  <div className="flex items-start justify-between gap-3">

                    <h2
                      className="
                        text-xl
                        font-semibold
                        text-white
                        group-hover:text-purple-300
                        transition
                      "
                    >
                      {service.name}
                    </h2>

                    {/* Availability Badge */}

                    <span
                      className={`
                        shrink-0
                        inline-flex
                        items-center
                        gap-1
                        px-2.5
                        py-1
                        rounded-full
                        text-xs
                        font-medium
                        ${service.isAvailable
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

                  {/* ================================= */}
                  {/* DESCRIPTION */}
                  {/* ================================= */}

                  <p
                    className="
                      mt-3
                      text-sm
                      leading-6
                      text-white/60
                      min-h-[48px]
                    "
                  >
                    {service.description}
                  </p>

                  {/* ================================= */}
                  {/* SERVICE INFORMATION */}
                  {/* ================================= */}

                  <div className="grid grid-cols-2 gap-3 mt-6">

                    {/* Price */}

                    <div
                      className="
                        bg-white/10
                        border
                        border-white/10
                        rounded-xl
                        p-4
                      "
                    >

                      <div className="flex items-center gap-2 text-white/40">

                        <FaMoneyBillWave className="text-sm" />

                        <span className="text-xs">
                          Price
                        </span>

                      </div>

                      <p className="mt-2 text-white font-semibold">
                        Rs.{" "}
                        {service.price.toLocaleString()}
                      </p>

                    </div>

                    {/* Duration */}

                    <div
                      className="
                        bg-white/10
                        border
                        border-white/10
                        rounded-xl
                        p-4
                      "
                    >

                      <div className="flex items-center gap-2 text-white/40">

                        <FaClock className="text-sm" />

                        <span className="text-xs">
                          Duration
                        </span>

                      </div>

                      <p className="mt-2 text-white font-semibold">
                        {service.duration} min
                      </p>

                    </div>

                  </div>

                  {/* ================================= */}
                  {/* ACTION */}
                  {/* ================================= */}

                  <button
                    type="button"
                    disabled={!service.isAvailable}
                    onClick={() =>
                      navigate(
                        `/services/${service.categoryId}/${service.id}`
                      )
                    }
                    className={`
                      mt-6
                      w-full
                      py-3
                      rounded-lg
                      font-semibold
                      transition-all
                      ${service.isAvailable
                        ? `
                            bg-gradient-to-r
                            from-purple-600
                            to-pink-600
                            text-white
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
                      ? "View Details"
                      : "Service Unavailable"}
                  </button>

                </article>

              ))}

            </div>

          )}

        </div>

      </section>
    </>
  );
};

export default Services;

