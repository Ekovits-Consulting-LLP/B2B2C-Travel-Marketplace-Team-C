import { Link } from "react-router-dom";
import { Heart, MapPin, Star, Users, Calendar, Download, Crown, Sparkles, TrendingUp } from "lucide-react";

function PackageCard({ data }) {

  const saveAmount = data.oldPrice ? data.oldPrice - data.price : 0;

  return (

    <div className="card">

      {/* IMAGE */}
      <div className="card-image">

        <img src={data.image} alt={data.title} />

        {/* BADGES */}
        <div className="image-badges">

  {data.badge1 === "Featured" && (
    <span className="badge featured">
      ✨ Featured
    </span>
  )}

  {data.badge1 === "Premium" && (
    <span className="badge premium">
      ⭐ Premium
    </span>
  )}

  {data.badge1 === "Budget Friendly" && (
    <span className="badge budget">
      💰 Budget Friendly
    </span>
  )}

  {data.badge2 === "Luxury" && (
    <span className="badge luxury">
      👑 Luxury
    </span>
  )}

</div>

        {/* DISCOUNT */}
        {data.discount && (
          <div className="discount-badge">
            {data.discount}%
          </div>
        )}

        {/* HEART */}
        <button className="wishlist">
          <Heart size={18}/>
        </button>

        {/* IMAGE INFO */}
        <div className="image-info">

          <span>
            <Calendar size={14}/> {data.duration}
          </span>

          <span>
            <Users size={14}/> {data.people}
          </span>

        </div>

      </div>


      {/* BODY */}
      <div className="card-body">

        {/* TITLE */}
        <h3 className="card-title">
          {data.title}
        </h3>

        {/* LOCATION */}
        <p className="location">
          <MapPin size={14}/> {data.destination}
        </p>


        {/* AGENT */}
        <div className="agent-row">

  <div className="agent-avatar">
    {data.agent.charAt(0)}
  </div>

  <div className="agent-info">

    <p className="agent-name">
      {data.agent}
    </p>

    <p className="agent-rating">
      ⭐ {data.agentRating} rating
    </p>

  </div>

  <span className="reviews">
  <span className="review-icon">
    <TrendingUp size={14} />
  </span>
  {data.reviews}
</span>

</div>

        {/* RATING */}
        <div className="rating-box">

          <span className="rating-value">
            <Star size={14} className="star filled"/> {data.rating} / 5
          </span>

          <span className="review-text">
          ({data.reviews} reviews)
          </span>

        </div>


        {/* PRICE */}
        <div className="price-row">

          <div>

            <p className="start">
              Starting from
            </p>

            <p className="price">

<span className="new-price">
${data.price}
</span>

{data.oldPrice && (
<span className="old-price">
${data.oldPrice}
</span>
)}

</p>

            <p className="per">
              per person
            </p>

          </div>


          {saveAmount > 0 && (

            <div className="save">

              You save

              <span>
                ${saveAmount}
              </span>

            </div>

          )}

        </div>


        {/* BUTTON ROW */}
        <div className="button-row">

          <Link to={`/package/${data.id}`}>

<button className="details">
View Details
</button>

</Link>

          <button className="download">
            <Download size={16}/>
          </button>

        </div>


        <button className="compare">
          + Add to Compare
        </button>

      </div>

    </div>

  );
}

export default PackageCard;