import React from 'react';
import Navbar from '../Navbar';

function Contact() {
    return (
        <div className="contact-page">
            {/* Navbar (Assuming it's a separate component) */}
            <Navbar />

            {/* Heading and Introduction */}
            <section className="heading text-center py-8">
                <h1 className="text-3xl font-bold">Contact Us</h1>
                <p className="text-gray-600">We're here to answer your questions.</p>
            </section>

            {/* Contact Form */}
            <section className="contact-form max-w-md mx-auto">
                <form className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block">Name</label>
                        <input type="text" id="name" name="name" required className="w-full border rounded-md px-3 py-2" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block">Email</label>
                        <input type="email" id="email" name="email" required className="w-full border rounded-md px-3 py-2" />
                    </div>
                    <div>
                        <label htmlFor="subject" className="block">Subject</label>
                        <input type="text" id="subject" name="subject" required className="w-full border rounded-md px-3 py-2" />
                    </div>
                    <div>
                        <label htmlFor="message" className="block">Message</label>
                        <textarea id="message" name="message" required className="w-full border rounded-md px-3 py-2"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Send Message</button>
                </form>
            </section>

            {/* Alternative Contact Methods (Optional) */}
            <section className="alternative-contact max-w-md mx-auto mt-8">
                <h2 className="text-lg font-semibold">More Ways to Reach Us</h2>
                <ul className="mt-4">
                    <li className="flex items-center space-x-2">
                        <i className="fas fa-phone"></i>
                        <span>Phone: (your phone number)</span>
                    </li>
                    {/* Add live chat links here if applicable */}
                </ul>
            </section>

            {/* Social Media Links */}
            <section className="social-media max-w-md mx-auto mt-8">
                <h2 className="text-lg font-semibold">Follow Us</h2>
                <ul className="mt-4">
                    <li>
                        <a href="https://www.facebook.com/" className="flex items-center space-x-2">
                            <i className="fab fa-facebook-f"></i>
                            <span>Facebook</span>
                        </a>
                    </li>
                    {/* Add links to other active social media profiles */}
                </ul>
            </section>

            {/* Map Integration (Optional) */}
            <section className="map max-w-md mx-auto mt-8">
                {/* Embed a map component from a mapping service here */}
            </section>

            {/* Privacy Policy Link */}
            <p className="privacy text-center mt-8">
                <a href="/#" className="text-blue-500 hover:underline">Privacy Policy</a>
            </p>
        </div>
    );
}

export default Contact;
