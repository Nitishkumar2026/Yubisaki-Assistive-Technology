import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { isSupabaseConnected } from '../lib/supabaseClient';
import { submitContact } from '../lib/formsApi';
import PageHeader from '../components/PageHeader';
import { Mail, Phone, MapPin, User, Book, MessageSquare, Loader2 } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConnected) {
      toast.error('Form submission is currently disabled.');
      return;
    }
    setLoading(true);

    try {
      const submissionPromise = submitContact(formData);
      
      toast.promise(submissionPromise, {
        loading: 'Submitting your message...',
        success: () => {
          setLoading(false);
          setFormData({ name: '', email: '', subject: '', message: '' });
          return 'Message sent successfully!';
        },
        error: (err: any) => {
          setLoading(false);
          const errorMessage = err?.message || err?.toString() || 'Failed to send message. Please try again.';
          // Check if it's a network error - if so, don't show toast
          if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError') || errorMessage.includes('Network error')) {
            console.warn('Contact form network error:', errorMessage);
            // Return empty string to prevent toast display
            return '';
          }
          console.error('Submission error:', errorMessage);
          return `Failed to send message: ${errorMessage}`;
        },
      });
    } catch (err: any) {
      // Handle synchronous errors
      setLoading(false);
      const errorMessage = err?.message || err?.toString() || 'Failed to send message. Please try again.';
      if (!errorMessage.includes('Failed to fetch') && !errorMessage.includes('NetworkError')) {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out to us for any inquiries."
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
              <p className="text-gray-600 mb-6">We'll get back to you as soon as possible.</p>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" id="name" value={formData.name} onChange={handleChange} required className="pl-10 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="email" id="email" value={formData.email} onChange={handleChange} required className="pl-10 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                   <div className="relative">
                    <Book className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" id="subject" value={formData.subject} onChange={handleChange} required className="pl-10 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <div className="relative">
                     <MessageSquare className="absolute left-3 top-4 text-gray-400" size={20} />
                    <textarea id="message" rows={4} value={formData.message} onChange={handleChange} required className="pl-10 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"></textarea>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 20px -10px rgba(59, 130, 246, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full flex justify-center items-center bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={loading || !isSupabaseConnected}
                >
                  {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                  {loading ? 'Sending...' : 'Submit'}
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Info & Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4 text-gray-600">
                  <div className="flex items-center space-x-4">
                    <Mail size={20} className="text-blue-600" />
                    <span>info@yubisaki-tech.com</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone size={20} className="text-blue-600" />
                    <span>+91-7814889581</span>
                  </div>
                  <div className="flex items-start space-x-4">
                    <MapPin size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                    <span>5th Floor, IT Park<br /> Chandigarh</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg h-80 overflow-hidden">
                 <img
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop"
                    alt="Yubisaki Assistive Technology Office"
                    className="w-full h-full object-cover"
                  />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
