import React, { useState, useEffect } from "react";

/* DATA */
import { mockPackages, destinations } from "../data/mockData";

/* ICONS */
import {
  Globe,
  Users,
  Heart,
  Star,
  Target,
  CheckCircle,
  Shield,
  Sparkles,
  Crown,
  Calendar,
  MapPin,
  Clock,
  TrendingUp,
  ArrowRight,
  Download
} from "lucide-react";

import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaSearch,
  FaShieldAlt,
  FaUserCheck,
  FaCheckCircle,
  FaBullseye,
  FaDownload
} from "react-icons/fa";

/* SWIPER */
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

/* AOS */
import AOS from "aos";
import "aos/dist/aos.css";

function Home() {

  /* AOS INITIALIZE */

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out"
    });
  }, []);

  /* STATE */

  const [destination, setDestination] = useState("");

  /* DATA */

  const popularCities = [
    "Paris",
    "Bali",
    "Dubai",
    "Tokyo",
    "Maldives",
    "New York"
  ];

  const featuredPackages = mockPackages.filter(pkg => pkg.featured);

  return (
    <div>

      {/* ================= HERO SECTION ================= */}

      <section className="hero">

        <div className="hero-overlay">

          {/* HERO BADGE */}

          <div className="hero-badge" data-aos="zoom-in">
            <Sparkles className="badge-icon" />
            World's Leading Travel Marketplace
          </div>

          <h1 data-aos="zoom-in">
            Explore the World <br /> Your Way
          </h1>

          <p className="hero-subtitle" data-aos="zoom-in">
            Compare packages from 200+ verified travel agents and
            find the perfect trip within your budget
          </p>

          {/* SEARCH BAR */}

          <div className="hero-search" data-aos="zoom-in">

            <div className="search-item">
              <FaMapMarkerAlt />
              <input
                type="text"
                placeholder="Where to?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="search-item">
              <FaCalendarAlt />
              <input type="date" />
            </div>

            <div className="search-item">
              <FaUsers />
              <input type="number" placeholder="2" />
            </div>

            <button className="search-btn">
              <FaSearch /> Search
            </button>

          </div>

          {/* POPULAR DESTINATIONS */}

          <div className="popular-destinations" data-aos="zoom-in">

            <span>Popular destinations:</span>

            <div className="dest-tags">

              {popularCities.map((city) => (
                <span
                  key={city}
                  className="dest-chip"
                  onClick={() => setDestination(city)}
                >
                  {city}
                </span>
              ))}

            </div>

          </div>

          {/* HERO FEATURES */}

          <div className="hero-features" data-aos="zoom-in">

            <div className="feature-pill secure">
              <FaShieldAlt className="feature-icon" />
              100% Secure Booking
            </div>

            <div className="feature-pill verified">
              <FaUserCheck className="feature-icon" />
              Verified Agents
            </div>

            <div className="feature-pill price">
              <FaBullseye className="feature-icon" />
              Best Price Match
            </div>

          </div>

        </div>

      </section>


      {/* ================= STATS SECTION ================= */}

      <section className="stats" data-aos="fade-up">

        <div className="stats-container">

          <div className="stat-item">
            <div className="stat-icon blue">
              <Globe size={26} />
            </div>
            <h3>500+</h3>
            <p>Travel Packages</p>
          </div>

          <div className="stat-item">
            <div className="stat-icon orange">
              <Users size={26} />
            </div>
            <h3>200+</h3>
            <p>Verified Agents</p>
          </div>

          <div className="stat-item">
            <div className="stat-icon green">
              <Heart size={26} />
            </div>
            <h3>50K+</h3>
            <p>Happy Travelers</p>
          </div>

          <div className="stat-item">
            <div className="stat-icon blue">
              <Star size={26} />
            </div>
            <h3>4.8/5</h3>
            <p>Average Rating</p>
          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section className="how-it-works" data-aos="fade-up">

        <div className="container-custom">

          <div className="how-tag">⚡ HOW IT WORKS</div>

          <h2 className="how-title">Book Your Trip in 3 Easy Steps</h2>

          <div className="steps-container" data-aos="zoom-in">

            {/* STEP 1 */}

            <div className="step-card">

              <div className="step-number">01</div>

              <div className="icon blue">
                <Target size={28} />
              </div>

              <h3>Search & Compare</h3>

              <p>
                Enter your destination and browse packages from multiple verified agents
              </p>

              <div className="arrow">→</div>

            </div>

            {/* STEP 2 */}

            <div className="step-card">

              <div className="step-number">02</div>

              <div className="icon orange">
                <CheckCircle size={28} />
              </div>

              <h3>Choose Your Package</h3>

              <p>
                Compare prices, itineraries, and reviews to find the perfect match
              </p>

              <div className="arrow">→</div>

            </div>

            {/* STEP 3 */}

            <div className="step-card">

              <div className="step-number">03</div>

              <div className="icon green">
                <Shield size={28} />
              </div>

              <h3>Book Securely</h3>

              <p>
                Complete your booking with our secure payment system and get instant confirmation
              </p>

            </div>

          </div>

        </div>

      </section>

      <div className="section-divider"></div>


      {/* ================= TRENDING DESTINATIONS ================= */}

      <section className="destinations" data-aos="fade-up">

        <div className="dest-header">

          <span className="dest-tag">🌐 POPULAR DESTINATIONS</span>

          <h2>Trending Destinations</h2>

          <p>
            Discover the most sought-after destinations with packages to suit every budget
          </p>

        </div>

        <div className="dest-grid">

          {destinations.map((dest, index) => (

            <div className="dest-card" key={index} data-aos="zoom-in">

              <img src={dest.image} alt={dest.name} />

              <div className="dest-overlay">

                <h3>{dest.name}</h3>

                <div className="dest-bottom">

                  <span className="popular-badge">
                    ⭐ Popular
                  </span>

                  <button className="view-deals">
                    $ View Deals
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

        <button className="view-all-btn">
          View All Destinations →
        </button>

      </section>


      {/* ================= FEATURED PACKAGES ================= */}

      <section className="packages-section" data-aos="fade-up">

        {/* HEADER */}

        <div className="packages-header">

          <div className="packages-badge">
            <Sparkles size={16} /> FEATURED PACKAGES
          </div>

          <h2>Handpicked For You</h2>

          <p>
            Exclusive deals and premium experiences selected by our travel experts
          </p>

        </div>


        {/* SWIPER SLIDER */}

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={25}
          slidesPerView={4}
          loop={true}

          autoplay={{
            delay: 3000,
            disableOnInteraction: false
          }}

          pagination={{
            el: ".custom-pagination",
            clickable: true
          }}

          breakpoints={{
            1024: { slidesPerView: 4 },
            768: { slidesPerView: 2 },
            480: { slidesPerView: 1 }
          }}

          className="packages-slider"
        >

          {mockPackages.map((pkg, index) => (

            <SwiperSlide key={pkg.id}>

              {/* CARD */}

              <div className="travel-card" data-aos="zoom-in">

                {/* IMAGE */}

                <div className="travel-image">

                  <img src={pkg.image} alt={pkg.title} />

                  {/* TAGS */}

                  <div className="tag featured">
                    <Sparkles size={12} /> Featured
                  </div>

                  <div className="tag luxury">
                    <Crown size={12} /> Luxury
                  </div>

                  {/* DISCOUNT */}

                  <div className="wishlist-box">

                    <span className="discount">
                      {pkg.discount}%
                    </span>

                    <div className="wishlist">
                      <Heart size={16} />
                    </div>

                  </div>

                  {/* BADGES */}

                  <div className="image-badges">

                    <span>
                      <Calendar size={14} /> {pkg.days}
                    </span>

                    <span>
                      <Users size={14} /> {pkg.people}
                    </span>

                  </div>

                </div>


                {/* BODY */}

                <div className="travel-body">

                  <h3 className="title">{pkg.title}</h3>

                  <p className="location">
                    <MapPin size={14} /> {pkg.destination}
                  </p>


                  {/* PROVIDER */}

                  <div className="provider">

                    <div className="provider-left">

                      <div className="provider-icon">
                        {(pkg.provider || pkg.agentName)?.charAt(0)}
                      </div>

                      <div>

                        <p className="provider-name">
                          {pkg.provider}
                        </p>

                        <p className="provider-rating">
                          ⭐ {pkg.providerRating} rating
                        </p>

                      </div>

                    </div>

                    <div className="trend">
                      ↗ {pkg.trending}
                    </div>

                  </div>


                  {/* RATING */}

                  <div className="rating-box">

                    <span className="rating-star">
                      <Star size={14} /> {pkg.rating}
                    </span>

                    <span className="rating-value">/ 5</span>

                    <span className="reviews">
                      ({pkg.reviews} reviews)
                    </span>

                  </div>


                  {/* PRICE */}

                  <div className="price-section">

                    <div className="price-left">

                      <p className="starting">
                        Starting from
                      </p>

                      <div className="price-row">

                        <span className="price">
                          ${pkg.price}
                        </span>

                        <span className="old-price">
                          ${pkg.oldPrice}
                        </span>

                      </div>

                      <p className="per">
                        per person
                      </p>

                    </div>

                    <div className="save-box">

                      <p>You save</p>

                      <span className="save">
                        ${pkg.save}
                      </span>

                    </div>

                  </div>


                  {/* BUTTONS */}

                  <div className="card-buttons">

                    <button className="details-btn">
                      View Details
                    </button>

                    <button className="download-btn">
                      <Download />
                    </button>

                  </div>

                </div>

              </div>

            </SwiperSlide>

          ))}

        </Swiper>


        <div className="custom-pagination"></div>

        <div className="packages-footer">

          <button className="explore-btn">
            Explore All Packages <ArrowRight size={16} />
          </button>

        </div>

      </section>


      {/* ================= WHY CHOOSE US ================= */}

      <section className="why-section">

        <div className="why-header">

          <span className="why-tag">
            <FaCheckCircle /> WHY CHOOSE US
          </span>

          <h2>Travel with Confidence</h2>

        </div>

        <div className="why-cards" data-aos="zoom-in">

          <div className="why-card">

            <div className="why-icon blue">
              <Shield size={26} />
            </div>

            <h3>100% Verified Agents</h3>

            <p>
              All travel agents are thoroughly verified and certified for your peace of mind
            </p>

          </div>

          <div className="why-card">

            <div className="why-icon orange">
              <Target size={26} />
            </div>

            <h3>Best Price Guaranteed</h3>

            <p>
              Compare prices from multiple agents and find the best deal for your budget
            </p>

          </div>

          <div className="why-card">

            <div className="why-icon green">
              <Clock size={26} />
            </div>

            <h3>24/7 Support</h3>

            <p>
              Our dedicated team is always here to help you plan your perfect journey
            </p>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className="cta-section">

        <div className="cta-container" data-aos="zoom-in">

          <h2>Ready to Start Your Journey?</h2>

          <p>
            Join thousands of happy travelers who found their perfect trip through our
            platform
          </p>

          <div className="cta-buttons">

            <button className="btn-primary">
              Browse Packages →
            </button>

            <button className="btn-outline">
              Become an Agent
            </button>

          </div>

        </div>

      </section>

      <div className="cta-footer-gap"></div>

    </div>
  );
}

export default Home;