import React from 'react';
import Navbar from '../Navbar';

function Services() {
    return (
        <>
            <Navbar />
            <div className="services-page">
                {/* Heading and Introduction */}
                <section className="heading text-center py-8">
                    <h1 className="text-3xl font-bold">Our Services</h1>
                    <p className="text-gray-600">Connecting vendors and customers for a seamless experience.</p>
                </section>

                {/* Vendor Services */}
                <section className="vendor-services max-w-md mx-auto">
                    <h2 className="text-xl font-semibold">Vendor Services</h2>
                    <ul className="mt-4">
                        <li className="flex items-center space-x-2">
                            <i className="fas fa-check-circle"></i>
                            <span>Easy onboarding process</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <i className="fas fa-lock"></i>
                            <span>Secure payment processing</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <i className="fas fa-bullhorn"></i>
                            <span>Marketing and promotional support</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <i className="fas fa-headset"></i>
                            <span>Customer service tools and support</span>
                        </li>
                    </ul>
                    {/* Consider a testimonial section here */}
                </section>

                {/* Customer Services */}
                <section className="customer-services max-w-md mx-auto mt-8">
                    <h2 className="text-xl font-semibold">Customer Services</h2>
                    <ul className="mt-4">
                        <li className="flex items-center space-x-2">
                            <i className="fas fa-shopping-cart"></i>
                            <span>Wide variety of products</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <i className="fas fa-dollar-sign"></i>
                            <span>Competitive pricing</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <i className="fas fa-shield-alt"></i>
                            <span>Secure transactions</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <i className="fas fa-truck"></i>
                            <span>Convenient delivery options</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <i className="fas fa-life-ring"></i>
                            <span>Customer support</span>
                        </li>
                    </ul>
                </section>

                {/* Call to Action */}
                <section className="cta text-center mt-8">
                    {/* Buttons or links for vendor signup and customer exploration */}
                </section>
            </div>
        </>
    );
}

export default Services;
