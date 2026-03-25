
import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import "../App.css";
import { MapPin, Calendar, Users, Heart, Share2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/packageDetails.css";

function ExplorePackage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeDay, setActiveDay] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [packageReviews, setPackageReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState({ review_type: 'package', rating: 5, description: '' });
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [shareMessage, setShareMessage] = useState('');
    const [isBooked, setIsBooked] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('user');
            if (stored) setCurrentUser(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        if (!id) return;
        const saved = JSON.parse(localStorage.getItem('savedPackages') || '[]');
        setIsSaved(saved.includes(Number(id)));
    }, [id]);

    useEffect(() => {
        if (!id || !currentUser) {
            setIsBooked(false);
            return;
        }

        const checkBooking = async () => {
            try {
                const byUserRes = await fetch(`/api/bookings?booked_by=${currentUser.id}&package_id=${id}`);
                const byUser = await byUserRes.json();
                if (Array.isArray(byUser) && byUser.length > 0) {
                    setIsBooked(true);
                    return;
                }

                const byEmailRes = await fetch(`/api/bookings?email=${encodeURIComponent(currentUser.email)}&package_id=${id}`);
                const byEmail = await byEmailRes.json();
                if (Array.isArray(byEmail) && byEmail.length > 0) {
                    setIsBooked(true);
                    return;
                }

                setIsBooked(false);
            } catch (err) {
                console.error('Error checking booking status:', err);
                setIsBooked(false);
            }
        };

        checkBooking();
    }, [id, currentUser]);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/packages/${id}`)
            .then(res => res.json())
            .then(data => {
                // Parse optional JSON fields - handle both string and object formats
                try {
                    if (typeof data.itinerary === 'string') {
                        data.itinerary = JSON.parse(data.itinerary);
                    }
                    if (typeof data.inclusions === 'string') {
                        data.inclusions = JSON.parse(data.inclusions);
                    }
                    if (typeof data.exclusions === 'string') {
                        data.exclusions = JSON.parse(data.exclusions);
                    }
                    if (typeof data.images === 'string') {
                        data.images = JSON.parse(data.images);
                    }
                    if (typeof data.hotels === 'string') {
                        data.hotels = JSON.parse(data.hotels);
                    }
                    // Ensure arrays are arrays
                    if (!Array.isArray(data.inclusions)) data.inclusions = [];
                    if (!Array.isArray(data.exclusions)) data.exclusions = [];
                    if (!Array.isArray(data.itinerary)) data.itinerary = [];
                } catch (parseError) {
                    console.error('Error parsing package data:', parseError);
                    data.inclusions = [];
                    data.exclusions = [];
                    data.itinerary = [];
                }
                
                console.log('Package data loaded:', {
                    title: data.title,
                    inclusions: data.inclusions,
                    exclusions: data.exclusions,
                    itineraryCount: data.itinerary.length
                });
                
                setSelectedPackage(data);
                if (data.images && data.images.length > 0) {
                    setSelectedImage(`/uploads/${data.images[0]}`);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching package:", err);
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        const fetchPackageReviews = async () => {
            if (!id) return;
            try {
                const res = await fetch(`/api/packages/${id}/reviews`);
                const data = await res.json();
                setPackageReviews(data);
            } catch (err) {
                console.error('Error fetching package reviews', err);
            }
        };

        fetchPackageReviews();
    }, [id]);

    const toggleSave = () => {
        const savedPackages = JSON.parse(localStorage.getItem('savedPackages') || '[]');
        const pkgId = Number(id);
        let updated;
        if (savedPackages.includes(pkgId)) {
            updated = savedPackages.filter((x) => x !== pkgId);
            setIsSaved(false);
            setShareMessage('Removed from saved packages.');
        } else {
            updated = [...savedPackages, pkgId];
            setIsSaved(true);
            setShareMessage('Added to saved packages.');
        }
        localStorage.setItem('savedPackages', JSON.stringify(updated));
        setTimeout(() => setShareMessage(''), 2500);
    };

    const handleShare = async () => {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({ title: selectedPackage.title, url, text: 'Check out this travel package on TravelHub!' });
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(url);
                setShareMessage('Link copied to clipboard.');
            } else {
                setShareMessage('Share not supported, please copy the URL manually.');
            }
        } catch (err) {
            console.error('Share failed', err);
            setShareMessage('Unable to share right now.');
        }
        setTimeout(() => setShareMessage(''), 2500);
    };

    const handleContactSupport = () => {
        const supportEmail = 'support@travelhub.com';
        const subject = encodeURIComponent(`Support request for package ${selectedPackage.title}`);
        const body = encodeURIComponent(`Hi Support,\n\nI need help with booking the package: ${selectedPackage.title} (ID ${selectedPackage.id}).\n\nThanks,\n${currentUser?.full_name || 'Guest'}`);
        window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
    };

    const handleBookNow = () => {
        if (!currentUser) {
            alert('Please login as customer to book this package.');
            navigate('/login');
            return;
        }
        // Navigate to booking flow page
        navigate(`/book/${id}`);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewError('');
        setReviewSuccess('');

        if (!currentUser) {
            setReviewError('Please login to submit a review.');
            return;
        }

        if (!reviewForm.description.trim()) {
            setReviewError('Please enter a review message.');
            return;
        }

        if (!selectedPackage) {
            setReviewError('No package loaded.');
            return;
        }

        if (!isBooked) {
            setReviewError('You can submit a review only after booking this package.');
            return;
        }

        setReviewLoading(true);

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    consumer_id: currentUser.id,
                    package_id: selectedPackage.id,
                    agent_id: selectedPackage.agent_id,
                    review_type: reviewForm.review_type,
                    rating: Number(reviewForm.rating),
                    description: reviewForm.description.trim()
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to submit review');
            }

            setReviewSuccess('Review submitted successfully');
            setReviewForm({ review_type: 'package', rating: 5, description: '' });
            const refresh = await fetch(`/api/packages/${id}/reviews`);
            setPackageReviews(await refresh.json());
        } catch (err) {
            console.error(err);
            setReviewError(err.message);
        } finally {
            setReviewLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading package details...</div>;
    if (!selectedPackage) return <div className="error">Package not found</div>;

           

    return (
        <div>
            <div className="details-container">
                <p className="breadcrumb">
                    <span style={{ cursor: "pointer" }} onClick={() => navigate("/")}>Home</span>
                    {" / "}
                    <span style={{ cursor: "pointer" }} onClick={() => navigate("/packagespecific")}>Packages</span>
                    {" / "} {selectedPackage.title}
                </p>

                <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Back to Search
                </button>

                <div className="details-top">
                    <div className="details-image">
                        <img 
  src={selectedImage || "/images/placeholder.jpg"} 
  alt={selectedPackage.title} 
  className="main-img" 
/>
                        
                        <div className="thumbnail-row">
  {selectedPackage.images?.map((img, index) => {
    const imageUrl = `/uploads/${img}`;
    return (
      <img
        key={index}
        src={imageUrl}
        alt={`thumb ${index}`}
        className={`thumbnail ${selectedImage === imageUrl ? "active" : ""}`}
        onClick={() => setSelectedImage(imageUrl)}
      />
    );
  })}
</div>
</div>  

                    <div className="price-card">
                        <div className="price-card-top">
                            <div>
                                <p className="price-label">Starting from</p>
                                <h2 className="price">
                                    Rs.{Number(selectedPackage.final_price || selectedPackage.price).toLocaleString("en-IN")}
                                    {selectedPackage.offer_percent > 0 && (
                                        <span className="old-price">Rs.{Number(selectedPackage.price).toLocaleString("en-IN")}</span>
                                    )}
                                </h2>
                                <p className="per-person">per person</p>
                            </div>

                            <div className="price-card-secondary">
                                {selectedPackage.offer_percent > 0 && (
                                    <div className="save-tag">Save {selectedPackage.offer_percent}%</div>
                                )}

                                <div className="action-row">
                                    <button
                                        className={`icon-only-btn ${isSaved ? 'saved' : ''}`}
                                        onClick={toggleSave}
                                        title={isSaved ? 'Unsave' : 'Save'}
                                        aria-label={isSaved ? 'Unsave package' : 'Save package'}
                                    >
                                        <Heart className="action-icon" />
                                    </button>

                                    <button
                                        className="icon-only-btn"
                                        onClick={handleShare}
                                        title="Share"
                                        aria-label="Share package"
                                    >
                                        <Share2 className="action-icon" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button className="book-btn" onClick={handleBookNow}>Book Now</button>

                        {shareMessage && <p className="share-message">{shareMessage}</p>}

                        <div className="help-card">
                            <h4>Need Help?</h4>
                            <p className="help-text">
                                Have questions about this package? Contact our travel experts.
                            </p>
                            <button className="contact-btn" onClick={handleContactSupport}>Contact Support</button>
                        </div>
                    </div>
                </div>

                <div className="details-card">
                    <h2>{selectedPackage.title}</h2>
                    <div className="meta-row">
                        <span className="meta-item">
                            <MapPin /> {selectedPackage.destination}
                        </span>
                        <span className="meta-item">
                            <Calendar className="meta-icon" /> {selectedPackage.days} Days / {selectedPackage.nights} Nights
                        </span>
                        <span className="meta-item">
                            <Users className="meta-icon" /> Max {selectedPackage.travelers} travelers
                        </span>

                    </div>

                    <div className="review-row">
                        <div className="review-left">
                            ⭐ {selectedPackage.rating || "4.5"} <span className="review-count">(Local Reviews)</span>
                        </div>
                        <div className="tags">
                            {selectedPackage.package_types && (typeof selectedPackage.package_types === 'string' ? JSON.parse(selectedPackage.package_types) : selectedPackage.package_types).map((type, i) => (
                                <span key={i}>{type}</span>
                            ))}
                        </div>
                    </div>

                    <hr />
                    <h3>Overview</h3>
                    <p className="overview-text">{selectedPackage.description}</p>
                </div>

                <div className="details-card">
                    <h3>Day-wise Itinerary</h3>
                    <div className="itinerary">
                        {selectedPackage.itinerary && selectedPackage.itinerary.length > 0 ? (
                            selectedPackage.itinerary.map((day, index) => {
                                const isOpen = activeDay === index;
                                return (
                                    <div key={index} className="day-item">
                                        <div
                                            className="day-header"
                                            onClick={() => setActiveDay(isOpen ? null : index)}
                                        >
                                            <span className="day-badge">{index + 1}</span>
                                            <span className="day-title">
                                                {day.title || day.activity || `Day ${index + 1}`}
                                            </span>
                                        </div>
                                        {isOpen && (
                                            <div className="day-content">
                                                {(() => {
                                                    const hotels = Array.isArray(selectedPackage.hotels) ? selectedPackage.hotels : [];
                                                    const hotelForDay = hotels.find((ht) => {
                                                        if (!ht) return false;
                                                        if (typeof ht === 'string') return false;
                                                        const dayField = ht.day || ht.day_number || ht.dayNumber || ht.Days;
                                                        return Number(dayField) === index + 1;
                                                    });

                                                    let hotelName = null;
                                                    if (hotelForDay) {
                                                        hotelName = hotelForDay.hotel_name || hotelForDay.name || hotelForDay.title || hotelForDay.hotel || null;
                                                    }

                                                    if (!hotelName && typeof hotels[index] === 'string') {
                                                        hotelName = hotels[index];
                                                    }

                                                    return hotelName ? (
                                                        <p className="day-hotel" style={{ marginBottom: '8px', color: '#0f172a' }}>
                                                            <strong>Hotel: </strong> {hotelName}
                                                        </p>
                                                    ) : null;
                                                })()}
                                                {day.description && (
                                                    <p className="day-desc">{day.description}</p>
                                                )}
                                                {day.meals && (
                                                    <p className="day-meals">
                                                        <strong>Meals:</strong>{" "}
                                                        {[
                                                            day.meals.breakfast && "Breakfast",
                                                            day.meals.lunch && "Lunch",
                                                            day.meals.dinner && "Dinner",
                                                        ]
                                                            .filter(Boolean)
                                                            .join(", ")}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p>No itinerary available (length: {selectedPackage.itinerary?.length || 0})</p>
                        )}
                    </div>
                </div>

                <div className="grid-two">
                    <div className="details-card">
                        <h3 className="green">Inclusions</h3>
                        <ul className="include-list">
                            {selectedPackage.inclusions && selectedPackage.inclusions.length > 0 ? (
                                selectedPackage.inclusions.map((item, i) => <li key={i}>{item}</li>)
                            ) : (
                                <li>No inclusions available (length: {selectedPackage.inclusions?.length || 0})</li>
                            )}
                        </ul>
                    </div>

                    <div className="details-card">
                        <h3 className="red">Exclusions</h3>
                        <ul className="exclude-list">
                            {selectedPackage.exclusions && selectedPackage.exclusions.length > 0 ? (
                                selectedPackage.exclusions.map((item, i) => <li key={i}>{item}</li>)
                            ) : (
                                <li>No exclusions available (length: {selectedPackage.exclusions?.length || 0})</li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="details-card">
                    <h3>Travel Agent</h3>
                    <div className="agent">
                        <img src={selectedPackage.company_logo ? `/uploads/${selectedPackage.company_logo}` : "/images/agents/placeholder.jpg"} alt="agent" />
                        <div>
                            <h4>{selectedPackage.agency_name || selectedPackage.agent_name || "Verified Agent"}</h4>
                            <p>⭐ 4.6 rating • Professional Support</p>
                        </div>
                    </div>
                </div>

                <div className="details-card">
                    <h3>Customer Reviews</h3>

                    <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                        <strong>{packageReviews.length} review{packageReviews.length === 1 ? '' : 's'}</strong>
                        <span>
                            Avg Rating: {packageReviews.length > 0 ? (packageReviews.reduce((acc, r) => acc + (r.rating || 0), 0) / packageReviews.length).toFixed(1) : 'N/A'} ⭐
                        </span>
                    </div>

                    {reviewError && <div style={{ color: 'red', marginBottom: '8px' }}>{reviewError}</div>}
                    {reviewSuccess && <div style={{ color: 'green', marginBottom: '8px' }}>{reviewSuccess}</div>}

                    {!currentUser && (
                        <div style={{ marginBottom: '16px', color: '#475569' }}>
                            Please login to submit a review.
                        </div>
                    )}

                    {currentUser && !isBooked && (
                        <div style={{ marginBottom: '16px', color: '#475569' }}>
                            You can add a review only after booking this package.
                        </div>
                    )}

                    {currentUser && isBooked && (
                        <>
                            <div style={{ marginBottom: '16px' }}>
                                <select
                                    value={reviewForm.review_type}
                                    onChange={(e) => setReviewForm({ ...reviewForm, review_type: e.target.value })}
                                    style={{ marginRight: '8px' }}
                                >
                                    <option value="package">Package</option>
                                    <option value="agent">Agent</option>
                                </select>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={reviewForm.rating}
                                    onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                                    style={{ width: '80px', marginRight: '8px', padding: '6px' }}
                                />
                                <span>{`Logged as: ${currentUser.full_name}`}</span>
                            </div>
                            <textarea
                                value={reviewForm.description}
                                onChange={(e) => setReviewForm({ ...reviewForm, description: e.target.value })}
                                placeholder="Write your review..."
                                style={{ width: '100%', minHeight: '100px', marginBottom: '8px', padding: '8px' }}
                            />
                            <button onClick={handleReviewSubmit} disabled={reviewLoading} style={{ padding: '10px 16px', background: '#1f7a96', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                {reviewLoading ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </>
                    )}

                    <div style={{ marginTop: '18px' }}>
                        {packageReviews.length === 0 && <p>No reviews yet. Be the first to review.</p>}
                        {packageReviews.map((rev) => (
                            <div key={rev.id} style={{ borderTop: '1px solid #e5e7eb', padding: '12px 0' }}>
                                <div style={{ fontWeight: '700' }}>{rev.consumer_name} ({rev.review_type})</div>
                                <div style={{ fontSize: '14px', color: '#64748b' }}>{rev.rating} ⭐</div>
                                <div style={{ marginTop: '6px' }}>{rev.description}</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{new Date(rev.created_at).toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ExplorePackage;