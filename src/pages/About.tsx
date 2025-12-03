import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Globe, Lightbulb, Target, Shield, Linkedin } from 'lucide-react';

const About: React.FC = () => {
  const milestones = [
    { year: '1984', title: 'Company Founded', description: 'Started as a small software consultancy' },
    { year: '1995', title: 'First Major Product', description: 'Launched enterprise management solution' },
    { year: '2005', title: 'Global Expansion', description: 'Expanded operations to international markets' },
    { year: '2015', title: 'AI Integration', description: 'Pioneered AI-powered business solutions' },
    { year: '2020', title: 'Cloud Innovation', description: 'Launched comprehensive cloud platform' },
    { year: '2025', title: 'Future Vision', description: 'Leading next-gen assistive technologies' },
  ];

  const leadership = [
    {
      name: 'Nitish Kumar',
      position: 'Chief Executive Officer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
      linkedin: '#'
    },
    {
      name: 'Himanshu Kumar',
      position: 'Chief Technology Officer',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
      linkedin: '#'
    },
    {
      name: 'Harsh Gupta',
      position: 'Chief Innovation Officer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
      linkedin: '#'
    },
    {
      name: 'Jyoti Mishra',
      position: 'Chief Operations Officer',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
      linkedin: '#'
    }
  ];

  const certifications = [
    { name: 'ISO 9001:2015', icon: Award },
    { name: 'CMMI Level 5', icon: Target },
    { name: 'SOC 2 Type II', icon: Shield },
    { name: 'GDPR Compliant', icon: Globe },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">About Yubisaki</h1>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Four decades of innovation, expertise, and commitment to transforming businesses through technology
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  To empower businesses with innovative software solutions that drive growth, 
                  efficiency, and digital transformation. We believe in creating technology 
                  that makes a meaningful impact on people's lives and business operations.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  To be the global leader in assistive technology solutions, setting new 
                  standards for innovation, quality, and customer satisfaction in the 
                  software industry.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
                alt="Team collaboration"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent rounded-lg"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">Milestones that shaped our company</p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200 hidden md:block"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="md:flex items-center md:space-x-8"
                >
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:text-right' : 'md:order-2 md:text-left'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-4 md:mb-0">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex md:w-auto md:order-1 items-center justify-center">
                     <div className="w-4 h-4 bg-blue-600 rounded-full relative z-10"></div>
                  </div>
                   <div className="md:w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600">Meet the visionaries driving our success</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((leader, index) => (
              <motion.div
                key={leader.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="relative mb-6">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-32 h-32 mx-auto rounded-full object-cover shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{leader.name}</h3>
                <p className="text-gray-600 mb-4">{leader.position}</p>
                <a
                  href={leader.linkedin}
                  className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-200"
                >
                  <Linkedin size={20} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Certifications & Awards</h2>
            <p className="text-xl text-gray-600">Recognition of our commitment to excellence</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <cert.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{cert.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
