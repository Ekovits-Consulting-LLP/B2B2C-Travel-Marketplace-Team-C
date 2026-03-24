import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";


/* DATA */
import { destinations } from "../data/mockData";
import Footer from "../components/Footer";

/* LUCIDE ICONS */
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
  ArrowRight
} from "lucide-react";

/* REACT ICONS */
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaSearch,
  FaCheckCircle,
  FaClock
} from "react-icons/fa";

/* SWIPER */
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";



function Home() {
  
  const navigate = useNavigate();


  /* STATE */

  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelers, setTravelers] = useState("");
  const [packages, setPackages] = useState([]);
  const [savedPackages, setSavedPackages] = useState([]);

  useEffect(() => {
    const storedSaved = localStorage.getItem('savedPackages');
    if (storedSaved) {
      try { setSavedPackages(JSON.parse(storedSaved)); } catch (e) { setSavedPackages([]); }
    }
  }, []);

  const toggleSave = (id) => {
    let updated;
    if (savedPackages.includes(id)) {
      updated = savedPackages.filter((pid) => pid !== id);
    } else {
      updated = [...savedPackages, id];
    }
    setSavedPackages(updated);
    localStorage.setItem('savedPackages', JSON.stringify(updated));
  };

  const isSaved = (id) => savedPackages.includes(id);

      useEffect(() => {
    fetch("http://localhost:5000/api/featured-packages")
      .then(res => res.json())
      .then(data => {
        console.log('Featured packages received:', data);
        const processedPackages = data.map(pkg => {
          // Handle images - ensure it's an array
          let images = pkg.images || [];
          if (typeof images === 'string') {
            try {
              images = JSON.parse(images);
            } catch(e) {
              images = [];
            }
          }
          if (!Array.isArray(images)) {
            images = [];
          }
          
          return {
            ...pkg,
            images: images,
            final_price: pkg.offer_percent > 0 
              ? Number(pkg.price) - (Number(pkg.price) * Number(pkg.offer_percent) / 100)
              : Number(pkg.price),
            oldPrice: pkg.offer_percent > 0 ? Number(pkg.price) : null,
            save: pkg.offer_percent > 0 
              ? Number(pkg.price) - (Number(pkg.price) - (Number(pkg.price) * Number(pkg.offer_percent) / 100))
              : 0,
            discount: pkg.offer_percent || 0,
            duration: `${pkg.days || 0}D/${pkg.nights || 0}N`
          };
        });
        console.log('Processed packages:', processedPackages);
        setPackages(processedPackages);
      })
      .catch(err => console.error("Error fetching packages:", err));
  }, []);

  const normalizeDestination = (name) => {
    if (!name || !name.trim()) return "";
    return name.split(",")[0].trim();
  };

  const handleSearchClick = () => {
    if (!destination.trim()) {
      alert("Please enter a destination to search.");
      return;
    }
    const normalized = normalizeDestination(destination);
    navigate(`/packagespecific/${encodeURIComponent(normalized)}`, { 
      state: { 
        destination,
        travelDate,
        travelers
      } 
    });
  };


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
          <input 
            type="date" 
            placeholder="When?"
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
          />
        </div>

        <div className="search-item">
          <FaUsers />
          <input 
            type="number" 
            placeholder="Group size"
            value={travelers}
            onChange={(e) => setTravelers(e.target.value)}
          />
        </div>

      </div>

      <button className="search-main-btn" onClick={handleSearchClick}>
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

                  <button className="view-deals" onClick={() => {
                    const normalized = normalizeDestination(dest.name);
                    navigate(`/packagespecific/${encodeURIComponent(normalized)}`, { state: { destination: dest.name } });
                  }}>
                    View Deals
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

        <button className="view-all-btn" onClick={() => navigate("/destination")}>
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

          {packages.map((pkg, index) => (

            <SwiperSlide key={pkg.id}>

              {/* CARD */}

              <div className="travel-card">

                {/* IMAGE */}

                <div className="travel-image">

                 <img 
                   src={pkg.images && Array.isArray(pkg.images) && pkg.images.length > 0 ? `/uploads/${pkg.images[0]}` : 'https://via.placeholder.com/400x300?text=No+Image'} 
                   alt={pkg.title} 
                   onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                 />

                  {/* TAGS */}


                  {/* DISCOUNT */}

                  {pkg.discount > 0 && (
                    <div className="wishlist-box">
                      <span className="discount">
                        {pkg.discount}%
                      </span>
                    </div>
                  )}

                  {/* BADGES */}

                  <div className="image-badges">

                    <span>
                      <Calendar size={14} /> {pkg.duration}
                    </span>

                    <span>
                      <Users size={14} /> {pkg.travelers}
                    </span>

                  </div>

                </div>


                {/* BODY */}

                <div className="travel-body">

                  <h3 className="title">{pkg.title}</h3>

                  <p className="location">
                    <MapPin size={14} /> {pkg.destination}
                  </p>




                  {/* RATING */}

                  <div className="rating-box">

                    <span className="rating-star">
                      <Star size={14} /> {pkg.rating}
                    </span>

                    <span className="rating-value">/ 5</span>


                  </div>


                  {/* PRICE */}

                  <div className="price-section">

                    <div className="price-left">

                      <p className="starting">
                        Starting from
                      </p>

                      <div className="price-row">

                        <span className="price">
                        ₹{Number(pkg.final_price).toLocaleString("en-IN")}
                        </span>

                        {pkg.oldPrice && (
                          <span className="old-price">
                            Rs. {Number(pkg.oldPrice).toLocaleString("en-IN")}
                          </span>
                        )}

                      </div>

                      <p className="per">
                        per person
                      </p>

                    </div>

                    {pkg.save > 0 && (
                      <div className="save-box">

                        <p>You save</p>

                        <span className="save">
                          Rs. {Number(pkg.save).toLocaleString("en-IN")}
                        </span>

                      </div>
                    )}

                  </div>


                  {/* BUTTONS */}

                  <div className="card-buttons">

                    <button className="details-btn" onClick={() => navigate(`/package/${pkg.id}`)}>
                      Book Now
                    </button>

                    <button
                      className={`download-btn ${isSaved(pkg.id) ? 'saved' : ''}`}
                      onClick={() => toggleSave(pkg.id)}
                      aria-label={isSaved(pkg.id) ? 'Unsave' : 'Save'}
                    >
                      <Heart size={24} color={isSaved(pkg.id) ? '#e11d48' : '#6b7280'} fill={isSaved(pkg.id) ? '#e11d48' : 'none'} />
                    </button>

                  </div>

                </div>

              </div>

            </SwiperSlide>

          ))}

        </Swiper>

        <div className="custom-pagination"></div>

        <div className="packages-footer">

          <button className="explore-btn" onClick={() => navigate("/packagespecific")}>
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
              <FaClock size={24} color="white" />
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

            <button
              className="btn-primary"
              style={{ backgroundColor: "#ff6a00", color: "white" }}
            >
              Browse Packages →
            </button>

            <button className="btn-outline">
              Become an Agent
            </button>

          </div>

        </div>

      </section>

      <div className="cta-footer-gap"></div>
            <Footer />
    </div>
  );
}

export default Home;