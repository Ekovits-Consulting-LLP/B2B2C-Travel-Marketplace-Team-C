import React, { useState, useEffect } from "react";
import "../styles/Reviews.css";
import {
  Search,
  Filter,
  Star,
  ThumbsUp,
  Share2,
  Flag
} from "lucide-react";

function Reviews() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [reviews, setReviews] = useState([]);
  const [packages, setPackages] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    package_id: "",
    review_type: "package",
    rating: 5,
    description: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;

  const renderStars = (count) => {
    return (
      <div className="review-stars">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={i < count ? "star filled" : "star"} />
        ))}
      </div>
    );
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/reviews");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Error loading reviews", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/packages/approved");
      const data = await res.json();
      setPackages(data);
    } catch (err) {
      console.error("Error loading packages", err);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchPackages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("Please log in to submit a review.");
      return;
    }

    if (!form.package_id) {
      setError("Please select a package to review.");
      return;
    }

    if (!form.description.trim()) {
      setError("Please provide your review description.");
      return;
    }

    const selectedPackage = packages.find((pkg) => Number(pkg.id) === Number(form.package_id));
    if (!selectedPackage) {
      setError("Selected package is invalid.");
      return;
    }

    const payload = {
      consumer_id: user.id,
      package_id: Number(form.package_id),
      agent_id: selectedPackage.agent_id,
      review_type: form.review_type,
      rating: Number(form.rating),
      description: form.description.trim()
    };

    try {
      const res = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      setSuccess("Review submitted successfully.");
      setForm({ package_id: "", review_type: "package", rating: 5, description: "" });
      fetchReviews();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const filteredReviews = reviews
    .filter((item) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "package") return item.review_type === "package";
      if (activeFilter === "agent") return item.review_type === "agent";
      return true;
    })
    .filter((item) => {
      const text = searchText.toLowerCase();
      if (!text) return true;
      return (
        item.package_title?.toLowerCase().includes(text) ||
        item.agent_name?.toLowerCase().includes(text) ||
        item.consumer_name?.toLowerCase().includes(text) ||
        item.description?.toLowerCase().includes(text)
      );
    });

  return (
    <div className="reviews-page">

      <section className="review-hero">
        <div className="review-hero-content">
          <h1>Customer Reviews</h1>
          <p>Read authentic reviews from travelers who've experienced our tours</p>

          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search reviews by tour, agent, or text..."
            />
          </div>
        </div>
      </section>

      <section className="reviews-container">

        <div className="filter-card">
          <div className="filter-title">
            <Filter size={18} />
            <span>Filters</span>
          </div>

          <div className="rating-summary">
            <h2>{reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0.0"}</h2>
            <div className="stars">{renderStars(Math.round(reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / (reviews.length || 1)))} </div>
            <p>{reviews.length} reviews</p>
          </div>

          <div className="review-type">
            <h4>Review Type</h4>
            <button className={`review-btn ${activeFilter === "all" ? "active" : ""}`} onClick={() => setActiveFilter("all")}>All Reviews</button>
            <button className={`review-btn ${activeFilter === "package" ? "active" : ""}`} onClick={() => setActiveFilter("package")}>Package Reviews</button>
            <button className={`review-btn ${activeFilter === "agent" ? "active" : ""}`} onClick={() => setActiveFilter("agent")}>Agent Reviews</button>
          </div>

          <button className="clear-btn" onClick={() => { setActiveFilter("all"); setSearchText(""); }}>Clear Filters</button>
        </div>

        <div className="reviews">

          <div className="reviews-header">
            <h2>All Reviews ({filteredReviews.length})</h2>
            <select className="sort-select" onChange={(e) => {
              if (e.target.value === 'highest') {
                setReviews([...reviews].sort((a,b)=>b.rating-a.rating));
              } else if (e.target.value === 'lowest') {
                setReviews([...reviews].sort((a,b)=>a.rating-b.rating));
              } else {
                fetchReviews();
              }
            }}>
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>

          <div className="review-form-card">
            <h3>Add Your Review</h3>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <form onSubmit={handleSubmit}>
              <label>Package</label>
              <select value={form.package_id} onChange={(e)=>setForm({...form, package_id:e.target.value})}>
                <option value="">Select Package</option>
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>

              <label>Review For</label>
              <select value={form.review_type} onChange={(e)=>setForm({...form, review_type:e.target.value})}>
                <option value="package">Package</option>
                <option value="agent">Agent</option>
              </select>

              <label>Rating</label>
              <input
                type="number"
                min="1"
                max="5"
                value={form.rating}
                onChange={(e)=>setForm({...form, rating: e.target.value})}
              />

              <label>Review</label>
              <textarea
                value={form.description}
                onChange={(e)=>setForm({...form, description:e.target.value})}
                placeholder="Share your experience..."
              />

              <button type="submit" className="submit-btn">Submit Review</button>
            </form>
          </div>

          {loading && <p>Loading reviews...</p>}

          {!loading && filteredReviews.length === 0 && <p>No reviews found.</p>}

          {!loading && filteredReviews.map((r, index) => (
            <div className="review-card" key={`${r.id}-${index}`}>
              <div className="review-top">
                <div className="user">
                  <div className="avatar">{r.consumer_name ? r.consumer_name[0] : 'U'}</div>
                  <div>
                    <h4>{r.consumer_name || 'Guest'}</h4>
                    <p className="date">{new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                {renderStars(r.rating)}
              </div>

              <p className="tour">{r.review_type === 'agent' ? 'Agent Review' : 'Package Review'} • {r.package_title}</p>
              <p className="tour">Agent: {r.agent_name}</p>
              <h3>{r.description}</h3>

              <div className="review-actions">
                <span><ThumbsUp size={16} /> Helpful</span>
                <span><Share2 size={16} /> Share</span>
                <span><Flag size={16} /> Report</span>
              </div>
            </div>
          ))}

        </div>
      </section>
    </div>
  );
}

export default Reviews;