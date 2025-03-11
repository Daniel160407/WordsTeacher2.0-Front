import React from "react";
import "../../style/freemius/PricingCard.scss";

const PricingCard = ({
  title,
  description,
  price,
  features,
  onPurchase,
  plan,
}) => {
  return (
    <div className={`pricing-card ${plan}`}>
      <h2 className="plan-title">{title}</h2>
      <p className="plan-description">{description}</p>
      <p className="plan-price" dangerouslySetInnerHTML={{ __html: price }} />
      <ul className="plan-features">
        {features.map((feature, index) => (
          <li key={index} className={feature.disabled ? "disabled" : ""}>
            {feature.text}
          </li>
        ))}
      </ul>
      {plan !== "basic" && (
        <button className="plan-button" onClick={onPurchase}>
          Buy now
        </button>
      )}
    </div>
  );
};

export default PricingCard;
