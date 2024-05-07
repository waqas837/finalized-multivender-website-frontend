import React from 'react';
import Navbar from '../Navbar';

function About() {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <Navbar />
            <section className="hero bg-gray-900 text-white py-12 text-center">
                <h1 className="text-3xl font-bold">Your Multi-Vendor Marketplace</h1>
                <img src="..." alt="Marketplace image" className="mx-auto mt-4" />
            </section>

            {/* About Us Section */}
            <section className="about-us max-w-4xl mx-auto mt-8 px-4">
                <h2 className="text-2xl font-semibold mb-4">About Us</h2>
                <p className="text-gray-700">
                    {/* Add your about us content here */}
                </p>
            </section>

            {/* Call to Action */}
            <section className="cta text-center mt-8">
                {/* Buttons or links based on desired actions */}
            </section>
        </div>
    );
}

export default About;
