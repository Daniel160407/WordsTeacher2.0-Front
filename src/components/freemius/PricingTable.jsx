import React, { useEffect } from "react";
import "../../style/freemius/PricingTable.scss";
import axios from "axios";
import Cookies from "js-cookie";
import PricingCard from "../uiComponents/PricingCard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PricingTable = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = import.meta.env.VITE_FREEMIUS_API_URL;
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePurchase = async (planId) => {
    try {
      const handler = new FS.Checkout({
        product_id: "17995",
        plan_id: planId,
        public_key: import.meta.env.VITE_FREEMIUS_PUBLIC_KEY,
        image: "https://your-plugin-site.com/logo-100x100.png",
      });

      handler.open({
        name: "Words Teacher",
        licenses: 1,
        purchaseCompleted: (response) => {
          console.log("Purchase completed:", response);
        },
        success: async () => {
          try {
            const plan = {
              userId: Cookies.get("userId"),
              plan: "ultimate",
            };

            const response = await axios.put(
              `${API_BASE_URL}/purchase`,
              plan,
              {
                headers: {
                  Authorization: `${Cookies.get("token") || ""}`,
                },
              }
            );

            if (response.status === 200) {
              Cookies.set("plan", "ultimate", { expires: 365 });
            }
          } catch (error) {
            console.error("Failed to update plan:", error);
          }
        },
      });
    } catch (error) {
      console.error("Error during purchase:", error);
    }
  };

  const plans = [
    {
      title: "Basic Plan",
      plan: "basic",
      description: "A great starting point to get acquainted with the Words Teacher Application",
      price: "Free",
      features: [
        { text: "Free 7 day trial" },
        { text: "Add, remove, edit Words" },
        { text: "Find the words in dictionary" },
        { text: "Track your progress in statistics tab" },
        { text: "Tests tab | Translation exercises", disabled: true },
        { text: "Ability to add more than one language", disabled: true },
      ],
      onPurchase: null,
    },
    {
      title: "Pro Plan",
      plan: "pro",
      description: "Perfect for language learners who want access to translation exercises and manage multiple languages.",
      price: '<span class="capital">$2</span>.99 / month',
      features: [
        { text: "Add, remove, edit Words" },
        { text: "Find the words in dictionary" },
        { text: "Track your progress in statistics tab" },
        { text: "Tests tab | Translation exercises" },
        { text: "Ability to add more than one language" },
      ],
      onPurchase: () => handlePurchase(29884),
    },
    {
      title: "Ultimate Plan",
      plan: "ultimate",
      description: "All premium features with a one-time payment.",
      price: '<span class="capital">$8</span>.99 / once',
      features: [
        { text: "Add, remove, edit Words" },
        { text: "Find the words in dictionary" },
        { text: "Track your progress in statistics tab" },
        { text: "Tests tab | Translation exercises" },
        { text: "Ability to add more than one language" },
      ],
      onPurchase: () => handlePurchase(29884),
    },
  ];

  return (
    <div className="pricing-container">
      {plans.map((plan, index) => (
        <PricingCard
          key={index}
          plan={plan.plan}
          title={plan.title}
          description={plan.description}
          price={plan.price}
          features={plan.features}
          onPurchase={plan.onPurchase}
        />
      ))}
    </div>
  );
};

export default PricingTable;