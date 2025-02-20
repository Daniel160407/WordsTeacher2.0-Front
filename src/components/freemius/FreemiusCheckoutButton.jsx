import React, { useEffect } from 'react';

const FreemiusCheckoutButton = () => {
    useEffect(() => {
        // Load the Freemius checkout script dynamically
        const script = document.createElement('script');
        script.src = 'https://checkout.freemius.com/js/v1/';
        script.async = true;
        document.body.appendChild(script);

        // Initialize the Freemius Checkout handler
        script.onload = () => {
            const handler = new FS.Checkout({
                product_id: '17995', // Replace with your Freemius product ID
                plan_id: '29884', // Replace with your Freemius plan ID
                public_key: 'pk_f48e0489006bf60a839136153e9cf', // Replace with your Freemius public key
                image: 'https://your-plugin-site.com/logo-100x100.png', // Replace with your product logo URL
            });

            // Add event listener to the button
            const purchaseButton = document.getElementById('purchase');
            if (purchaseButton) {
                purchaseButton.addEventListener('click', (e) => {
                    e.preventDefault();

                    handler.open({
                        name: 'Words Teacher', // Replace with your product name
                        licenses: 1,
                        purchaseCompleted: (response) => {
                            // Logic to execute immediately after purchase confirmation
                            console.log('Purchase completed:', response);
                            console.log('User email:', response.user.email);
                            console.log('License key:', response.license.key);
                        },
                        success: (response) => {
                            // Logic to execute after the customer closes the checkout
                            console.log('Checkout closed after successful purchase:', response);
                            console.log('User email:', response.user.email);
                            console.log('License key:', response.license.key);
                        },
                    });
                });
            }
        };

        // Cleanup script on component unmount
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div>
            <button id="purchase">Buy Button</button>
        </div>
    );
};

export default FreemiusCheckoutButton;