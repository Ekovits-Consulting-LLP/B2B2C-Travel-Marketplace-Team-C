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
  ArrowRight,
  
} from "lucide-react";

import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaSearch,
  FaCheckCircle,

} from "react-icons/fa";

/* SWIPER */
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";



function Home() {


  /* STATE */

  const [destination, setDestination] = useState("");



  const featuredPackages = mockPackages.filter(pkg => pkg.featured);

  return (
    <div>

         {/* ================= HERO SECTION ================= */}

<section className="hero">

  <div className="hero-overlay">

    <h1 >
      Find Your Dream Adventure
    </h1>

    <p className="hero-subtitle" >
      Compare and book multi-day tours from 2,500+ operators worldwide
    </p>

    {/* SEARCH BAR */}

    <div className="search-box" >

      <div className="search-row full">
        <FaMapMarkerAlt />
        <input
          type="text"
          placeholder="Where do you want to go?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      <div className="search-row two-cols">

        <div className="search-item">
          <FaCalendarAlt />
          <input type="date" placeholder="When?" />
        </div>

        <div className="search-item">
          <FaUsers />
          <input type="number" placeholder="Group size" />
        </div>

      </div>

      <button className="search-main-btn">
        <FaSearch /> Search Tours
      </button>

    </div>
     {/* HERO STATS */}
     <div className="hero-stats" >

  <div className="hero-stat">
    <h3>50,000+</h3>
    <p>Tours</p>
  </div>

  <div className="hero-stat">
    <h3>2,500+</h3>
    <p>Operators</p>
  </div>

  <div className="hero-stat">
    <h3>200+</h3>
    <p>Countries</p>
  </div>

  <div className="hero-stat">
    <h3>1M+</h3>
    <p>Reviews</p>
  </div>

</div>

  </div>

</section>


{/* ================= STATS SECTION ================= */}

<section className="stats" >

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

      <section className="how-it-works">

        <div className="container-custom">

          <div className="how-tag">⚡ HOW IT WORKS</div>

          <h2 className="how-title">Book Your Trip in 3 Easy Steps</h2>

          <div className="steps-container" >

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

      <section className="destinations" >

        <div className="dest-header">

          <span className="dest-tag">🌐 POPULAR DESTINATIONS</span>

          <h2>Trending Destinations</h2>

          <p>
            Discover the most sought-after destinations with packages to suit every budget
          </p>

        </div>

        <div className="dest-grid">

          {destinations.map((dest, index) => (

            <div className="dest-card" key={index}>

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

      <section className="packages-section">

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

              <div className="travel-card">

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
                      <Heart />
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

        <div className="why-cards" >

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

        <div className="cta-container" >

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