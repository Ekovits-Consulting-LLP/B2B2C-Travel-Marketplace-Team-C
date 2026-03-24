import Footer from "../components/Footer";
import "../styles/packageDetails.css";
import "../styles/bookPackage.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const BookPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [step, setStep] = useState(1);
  const [traveler, setTraveler] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", country: "", age: "" });
  const [travelDate, setTravelDate] = useState("");
  const [travelerCount, setTravelerCount] = useState(2);
  const [additionalTravelers, setAdditionalTravelers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastBookingId, setLastBookingId] = useState(null);
  const [bookingComplete, setBookingComplete] = useState(false);

  useEffect(() => {
    fetch(`/api/packages/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPkg(data);
        const initialCount = data.travelers || 2;
        setTravelerCount(initialCount);
        setAdditionalTravelers(Array.from({ length: Math.max(0, initialCount - 1) }, () => ({ firstName: "", lastName: "", age: "" })));
      })
      .catch((err) => console.error("BookPackage fetch error", err));
  }, [id]);

  if (!pkg) return <div className="loading" style={{ padding: 40, textAlign: "center" }}><h3>Loading booking detail...</h3></div>;

  const handleContinue = async () => {
    if (step === 1) {
      if (!traveler.firstName || !traveler.lastName || !traveler.email || !travelDate || !traveler.age) {
        alert("Please complete traveler info, age, and travel date");
        return;
      }
      for (let i = 0; i < additionalTravelers.length; i++) {
        if (!additionalTravelers[i].firstName || !additionalTravelers[i].lastName || !additionalTravelers[i].age) {
          alert(`Please complete info for Traveler ${i + 2}`);
          return;
        }
      }
    }

    if (step === 3) {
      await handleConfirmBooking();
      return;
    }

    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const getTotalPrice = () => {
    const pricePerPerson = Number(pkg.final_price || pkg.price || 0);
    return (pricePerPerson * travelerCount).toLocaleString("en-IN", { maximumFractionDigits: 2 });
  };

  const handleConfirmBooking = async () => {
    if (isSubmitting) return;

    const userStr = localStorage.getItem("user");
    if (!userStr) {
        alert("Authentication failed: Please sign in to confirm booking.");
        navigate("/");
        return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          package_id: Number(id),
          customer_name: `${traveler.firstName} ${traveler.lastName}`,
          email: traveler.email,
          phone: traveler.phone,
          address: traveler.address,
          city: traveler.city,
          country: traveler.country,
          age: traveler.age,
          travelers: travelerCount,
          travel_date: travelDate,
          additional_travelers: additionalTravelers
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Booking failed");
      }
      const booking = await res.json();
      setLastBookingId(booking.id);
      setBookingComplete(true);
      alert("Booking Successful");
      setStep(3);
    } catch (err) {
      console.error(err);
      alert(`Could not confirm booking: ${err.message}`);
    }
    setIsSubmitting(false);
  };

  const downloadReceipt = async (bookingId) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/receipt`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token || 'dummy' : ''}`
        }
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Receipt download failed');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Receipt download error', err);
      alert(`Could not download receipt: ${err.message}`);
    }
  };

  const resetTravelerCount = (newCount) => {
    if (newCount < 1) return;
    setTravelerCount(newCount);
    setAdditionalTravelers((prev) => {
      const newTravelers = [...prev];
      if (newCount - 1 > newTravelers.length) {
        while (newTravelers.length < newCount - 1) {
          newTravelers.push({ firstName: "", lastName: "", age: "" });
        }
      } else if (newCount - 1 < newTravelers.length) {
        newTravelers.length = Math.max(0, newCount - 1);
      }
      return newTravelers;
    });
  };

  return (
    <>
    <div className="booking-wrapper">
      <h1 className="booking-title">Secure Checkout</h1>
      
      <div className="booking-progress">
        {[1, 2, 3].map((n) => (
          <div key={n} className={`booking-step ${n === step ? 'active' : ''} ${n < step ? 'completed' : ''}`}>
            <div className="booking-step-circle">
              {n < step ? '✓' : n}
            </div>
            <div className="booking-step-label">
              {n === 1 ? "Traveler Details" : n === 2 ? "Review" : "Payment"}
            </div>
          </div>
        ))}
      </div>

      <div className="booking-grid">
        <div className="booking-card">
          <h2>{step === 1 ? "Traveler Information" : step === 2 ? "Review Your Booking" : "Payment Details"}</h2>

          {step === 1 && (
            <div className="booking-form-grid">
              <div className="booking-input-group">
                <label>First Name</label>
                <input className="booking-input" placeholder="John" value={traveler.firstName} onChange={(e) => setTraveler({ ...traveler, firstName: e.target.value })} />
              </div>
              <div className="booking-input-group">
                <label>Last Name</label>
                <input className="booking-input" placeholder="Doe" value={traveler.lastName} onChange={(e) => setTraveler({ ...traveler, lastName: e.target.value })} />
              </div>
              <div className="booking-input-group full-width">
                <label>Email Address</label>
                <input className="booking-input" type="email" placeholder="john.doe@example.com" value={traveler.email} onChange={(e) => setTraveler({ ...traveler, email: e.target.value })} />
              </div>
              <div className="booking-input-group full-width">
                <label>Phone Number</label>
                <input className="booking-input" type="tel" placeholder="+1 (555) 000-0000" value={traveler.phone} onChange={(e) => setTraveler({ ...traveler, phone: e.target.value })} />
              </div>
              <div className="booking-input-group full-width">
                <label>Address</label>
                <input className="booking-input" placeholder="123 Travel Street" value={traveler.address} onChange={(e) => setTraveler({ ...traveler, address: e.target.value })} />
              </div>
              <div className="booking-input-group">
                <label>City</label>
                <input className="booking-input" placeholder="New York" value={traveler.city} onChange={(e) => setTraveler({ ...traveler, city: e.target.value })} />
              </div>
              <div className="booking-input-group">
                <label>Country</label>
                <input className="booking-input" placeholder="United States" value={traveler.country} onChange={(e) => setTraveler({ ...traveler, country: e.target.value })} />
              </div>
              
              <div className="booking-input-group" style={{ marginTop: "10px" }}>
                <label>Age</label>
                <input className="booking-input" type="number" min="0" placeholder="e.g. 30" value={traveler.age} onChange={(e) => setTraveler({ ...traveler, age: e.target.value })} />
              </div>

              <div className="booking-input-group" style={{ marginTop: "10px" }}>
                <label>Travel Date</label>
                <input className="booking-input" type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} />
              </div>

              <div className="booking-input-group" style={{ marginTop: "10px" }}>
                <label>Number of Travelers</label>
                <div className="booking-traveler-counter">
                  <button className="counter-btn" type="button" onClick={() => resetTravelerCount(travelerCount - 1)}>-</button>
                  <div className="counter-value">{travelerCount}</div>
                  <button className="counter-btn" type="button" onClick={() => resetTravelerCount(travelerCount + 1)}>+</button>
                </div>
              </div>

              {additionalTravelers.map((t, index) => (
                <div key={index} className="booking-input-group full-width" style={{ marginTop: "10px" }}>
                  <h3 style={{ marginBottom: "10px", fontSize: "1.05rem", color: "#475569", borderBottom: "1px solid #e2e8f0", paddingBottom: "5px" }}>Traveler {index + 2}</h3>
                  <div className="booking-form-grid">
                    <div className="booking-input-group">
                      <label>First Name</label>
                      <input className="booking-input" placeholder="First Name" value={t.firstName} onChange={(e) => {
                        const updated = [...additionalTravelers];
                        updated[index].firstName = e.target.value;
                        setAdditionalTravelers(updated);
                      }} />
                    </div>
                    <div className="booking-input-group">
                      <label>Last Name</label>
                      <input className="booking-input" placeholder="Last Name" value={t.lastName} onChange={(e) => {
                        const updated = [...additionalTravelers];
                        updated[index].lastName = e.target.value;
                        setAdditionalTravelers(updated);
                      }} />
                    </div>
                    <div className="booking-input-group">
                      <label>Age</label>
                      <input className="booking-input" type="number" min="0" placeholder="Age" value={t.age} onChange={(e) => {
                        const updated = [...additionalTravelers];
                        updated[index].age = e.target.value;
                        setAdditionalTravelers(updated);
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="review-container">
              <div className="review-block">
                <h3>Primary Contact</h3>
                <div className="review-item"><span className="review-label">Name:</span> <span className="review-value">{traveler.firstName} {traveler.lastName}</span></div>
                <div className="review-item"><span className="review-label">Age:</span> <span className="review-value">{traveler.age}</span></div>
                <div className="review-item"><span className="review-label">Email:</span> <span className="review-value">{traveler.email}</span></div>
                <div className="review-item"><span className="review-label">Phone:</span> <span className="review-value">{traveler.phone || "Not provided"}</span></div>
              </div>

              <div className="review-block">
                <h3>Travel Details</h3>
                <div className="review-item"><span className="review-label">Destination:</span> <span className="review-value">{pkg.destination}</span></div>
                <div className="review-item"><span className="review-label">Departure Date:</span> <span className="review-value">{travelDate || 'Not selected'}</span></div>
                <div className="review-item"><span className="review-label">Duration:</span> <span className="review-value">{pkg.days} Days / {pkg.nights} Nights</span></div>
                <div className="review-item"><span className="review-label">Hotel:</span> <span className="review-value">
                  {pkg.hotels && (typeof pkg.hotels === 'string' ? JSON.parse(pkg.hotels) : pkg.hotels).length > 0
                    ? (typeof (typeof pkg.hotels === 'string' ? JSON.parse(pkg.hotels) : pkg.hotels)[0] === 'string'
                        ? (typeof pkg.hotels === 'string' ? JSON.parse(pkg.hotels) : pkg.hotels)[0]
                        : (typeof pkg.hotels === 'string' ? JSON.parse(pkg.hotels) : pkg.hotels)[0].name || (typeof pkg.hotels === 'string' ? JSON.parse(pkg.hotels) : pkg.hotels)[0].hotel_name || "Accommodation Included")
                    : "Not specified"}
                </span></div>
                <div className="review-item"><span className="review-label">Travelers:</span> <span className="review-value">{travelerCount} Person(s)</span></div>
              </div>

              {additionalTravelers.length > 0 && (
                <div className="review-block">
                  <h3>Additional Travelers</h3>
                  {additionalTravelers.map((t, i) => (
                    <div key={i} className="review-item"><span className="review-label">Traveler {i + 2}:</span> <span className="review-value">{t.firstName} {t.lastName} (Age: {t.age})</span></div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="payment-container">
              {bookingComplete ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>✅</div>
                  <h2 style={{ color: "#10b981", marginBottom: "10px" }}>Booking Successful</h2>
                  <p>Your booking has been confirmed! Please keep your receipt for reference.</p>
                </div>
              ) : (
                <>
                  <div className="booking-form-grid" style={{ marginTop: "16px" }}>
                    <div className="booking-input-group full-width">
                      <label>Card Number</label>
                      <input className="booking-input" placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="booking-input-group full-width">
                      <label>Name on Card</label>
                      <input className="booking-input" placeholder="John Doe" />
                    </div>
                    <div className="booking-input-group">
                      <label>Expiry Date</label>
                      <input className="booking-input" placeholder="MM/YY" />
                    </div>
                    <div className="booking-input-group">
                      <label>CVV</label>
                      <input className="booking-input" placeholder="123" type="password" maxLength="4" />
                    </div>
                  </div>
                  <p style={{ marginTop: "20px", fontSize: "0.9rem", color: "#64748b" }}>
                    By confirming this booking, you agree to our Terms of Service and Cancellation Policy.
                  </p>
                </>
              )}
            </div>
          )}

          <div className="booking-navigation">
            {step > 1 ? (
              <button className="btn-back" onClick={handleBack}>← Back</button>
            ) : <div></div>}
            
            {step < 3 && (
              <button className="btn-next" onClick={handleContinue}>Continue to {step === 1 ? "Review" : "Payment"} →</button>
            )}
            {step === 3 && !bookingComplete && (
              <button className="btn-next" onClick={handleContinue} disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Confirm & Pay ₹" + getTotalPrice()}
              </button>
            )}
          </div>
        </div>

        <div className="booking-card" style={{ height: "fit-content", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <h2>Booking Summary</h2>
          <img className="summary-image" src={pkg.images && pkg.images[0] ? `/uploads/${pkg.images[0]}` : "/images/placeholder.jpg"} alt={pkg.title} />
          
          <h3 className="summary-title">{pkg.title}</h3>
          <div className="summary-location">📍 {pkg.destination}</div>
          
          <div className="summary-row">
            <span>Price per person</span>
            <span className="value">₹{Number(pkg.final_price || pkg.price).toLocaleString('en-IN')}</span>
          </div>
          <div className="summary-row">
            <span>Travelers</span>
            <span className="value">x {travelerCount}</span>
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span className="value">₹{Number((pkg.final_price || pkg.price) * travelerCount).toLocaleString('en-IN')}</span>
          </div>
          <div className="summary-row">
            <span>Taxes & Fees (10%)</span>
            <span className="value">₹{Number((pkg.final_price || pkg.price) * 0.1 * travelerCount).toLocaleString('en-IN')}</span>
          </div>
          
          <div className="summary-row total">
            <span>Total amount</span>
            <span style={{ color: "#2563eb" }}>₹{Number((pkg.final_price || pkg.price) * travelerCount * 1.1).toLocaleString('en-IN')}</span>
          </div>

          {bookingComplete && lastBookingId && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button onClick={() => downloadReceipt(lastBookingId)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' }}>
                Download Receipt
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default BookPackage;
