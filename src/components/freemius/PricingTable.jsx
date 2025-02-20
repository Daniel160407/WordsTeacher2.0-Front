import React, { useEffect } from "react";
import "../../style/freemius/PricingTable.scss";

const PricingTable = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.freemius.com/js/v1/";
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePurchase = (planId) => {
    const handler = new FS.Checkout({
      product_id: '17995',
      plan_id: planId,
      public_key: 'pk_f48e0489006bf60a839136153e9cf',
      image: 'https://your-plugin-site.com/logo-100x100.png',
    });

    handler.open({
      name: 'Words Teacher',
      licenses: 1,
      purchaseCompleted: (response) => {
        console.log('Purchase completed:', response);
        console.log('User email:', response.user.email);
        console.log('License key:', response.license.key);
      },
      success: (response) => {
        console.log('Checkout closed after successful purchase:', response);
        console.log('User email:', response.user.email);
        console.log('License key:', response.license.key);

      }
    });
  };

  return (
    <div className="pricing-container">
      <div className="pricing-card basic">
        <h2 className="plan-title">Basic Plan</h2>
        <p className="plan-description">A great starting point to get acquainted with the Words Teacher Application</p>
        <p className="plan-price">Free</p>
        <ul className="plan-features">
          <li>Add, remove, edit Words</li>
          <li>Find the words in dictionary</li>
          <li className="disabled">Tests tab | Translation excersices</li>
          <li className="disabled">Ability to add more then one language</li>
        </ul>
        <p>Active</p>
      </div>

      <div className="pricing-card pro">
        <h2 className="plan-title">Pro Plan</h2>
        <p className="plan-description">Perfect for professionals and businesses.</p>
        <p className="plan-price"><span className="capital">$4</span>.99 / month</p>
        <ul className="plan-features">
          <li>Add, remove, edit Words</li>
          <li>Find the words in dictionary</li>
          <li>Tests tab | Translation excersices</li>
          <li>Ability to add more then one language</li>
        </ul>
        <button className="plan-button" onClick={() => handlePurchase(29884)}>Buy now</button>
      </div>

      <div className="pricing-card ultimate">
        <h2 className="plan-title">Ultimate Plan</h2>
        <p className="plan-description">All premium features with a one-time payment.</p>
        <p className="plan-price"><span className="capital">$99</span>.99 / once</p>
        <ul className="plan-features">
          <li>Add, remove, edit Words</li>
          <li>Find the words in dictionary</li>
          <li>Tests tab | Translation excersices</li>
          <li>Ability to add more then one language</li>
        </ul>
        <button className="plan-button" onClick={() => handlePurchase(29884)}>Buy now</button>
      </div>
    </div>
  );
};

export default PricingTable;
