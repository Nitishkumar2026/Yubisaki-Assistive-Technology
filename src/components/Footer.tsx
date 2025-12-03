import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { isSupabaseConnected } from '../lib/supabaseClient';
import { subscribeNewsletter } from '../lib/formsApi';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Youtube, Loader2 } from 'lucide-react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConnected) {
      toast.error('Subscription is currently disabled.');
      return;
    }
    setLoading(true);

    try {
      const submissionPromise = subscribeNewsletter(email);
      
      toast.promise(submissionPromise, {
        loading: 'Subscribing...',
        success: () => {
          setLoading(false);
          setEmail('');
          return 'Successfully subscribed!';
        },
        error: (err: any) => {
          setLoading(false);
          const errorMessage = err?.message || err?.toString() || 'Subscription failed. Please try again.';
          // Check if it's a network error - if so, don't show toast
          if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError') || errorMessage.includes('Network error')) {
            console.warn('Subscription network error:', errorMessage);
            // Return empty string to prevent toast display
            return '';
          }
          console.error('Subscription error:', errorMessage);
          return errorMessage;
        },
      });
    } catch (err: any) {
      // Handle synchronous errors
      setLoading(false);
      const errorMessage = err?.message || err?.toString() || 'Subscription failed. Please try again.';
      if (!errorMessage.includes('Failed to fetch') && !errorMessage.includes('NetworkError')) {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src="https://i.postimg.cc/y85vLgcm/logo.jpg"
                  alt="Yubisaki Assistive Technology (YAT) Logo"
                  className="w-14 h-14 object-contain rounded-full shadow-lg shadow-blue-500/10 bg-white"
                />
                <div className="absolute inset-0 rounded-full bg-blue-500 opacity-10 blur-sm"></div>
              </div>
              <div>
                <div className="text-xl font-bold tracking-tight">Yubisaki</div>
                <div className="text-base text-gray-400 font-medium">Assistive Technology</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Innovating smart software solutions with 40+ years of industry experience. 
              We deliver cutting-edge technology solutions that transform businesses.
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                <Linkedin size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                <Youtube size={20} />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'About', path: '/about' },
                { name: 'Products', path: '/products' },
                { name: 'Services', path: '/services' },
                { name: 'Careers', path: '/careers' }
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="space-y-2">
              {[
                'Custom Software Development',
                'Mobile App Development',
                'AI/ML Solutions',
                'Cloud Solutions',
                'IT Consulting'
              ].map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-blue-400" />
                <span className="text-gray-400 text-sm">info@yubisaki-tech.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-blue-400" />
                <span className="text-gray-400 text-sm">+91-7814889581</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-blue-400 mt-1" />
                <span className="text-gray-400 text-sm">
                  5th Floor, IT Park<br />
                  Chandigarh<br />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-2 flex justify-center items-center bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                {loading ? 'Subscribing...' : 'Subscribe'}
              </motion.button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Yubisaki Assistive Technology. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
