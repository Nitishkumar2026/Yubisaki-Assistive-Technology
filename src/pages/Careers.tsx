import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { MapPin, Briefcase, Search, Loader2, PlusCircle, Edit, ShieldAlert, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConnected } from '../lib/supabaseClient';
import PostJobModal from '../components/PostJobModal';
import toast from 'react-hot-toast';

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

const Careers: React.FC = () => {
  const [jobListings, setJobListings] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingJob, setViewingJob] = useState<Job | null>(null);
  const { profile, isAdmin } = useAuth();

  const fetchJobs = async () => {
    if (!isSupabaseConnected || !supabase) {
      console.warn('Supabase is not connected. Cannot fetch jobs.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to load job listings. Please try again later.');
      } else {
        setJobListings(data as Job[] || []);
      }
    } catch (err: any) {
      console.error('Error fetching jobs:', err);
      if (err.message?.includes('Failed to fetch')) {
        toast.error('Network error: Unable to connect to the server. Please check your connection.');
      } else {
        toast.error('Failed to load job listings. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const departments = [...new Set(jobListings.map(j => j.department))];
  const [departmentFilter, setDepartmentFilter] = useState('All');

  const filteredJobs = departmentFilter === 'All'
    ? jobListings
    : jobListings.filter(job => job.department === departmentFilter);

  // Job Detail Modal Component
  const JobDetailModal = () => {
    if (!viewingJob) return null;
    
    return (
      <AnimatePresence>
        {isDetailModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsDetailModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-bold text-gray-900">{viewingJob.title}</h2>
                <button onClick={() => setIsDetailModalOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600">
                  <span className="flex items-center gap-2"><Briefcase size={18} /> {viewingJob.department}</span>
                  <span className="flex items-center gap-2"><MapPin size={18} /> {viewingJob.location}</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{viewingJob.type}</span>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h3>
                  <div 
                    className="prose max-w-none" 
                    dangerouslySetInnerHTML={{ __html: viewingJob.description }}
                  />
                </div>
                
                <div className="pt-4">
                  <Link to="/contact">
                    <motion.button 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }} 
                      className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                    >
                      Apply for this Position
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Careers at Yubisaki"
        subtitle="Join our team of innovators and build the future of technology"
      />

      <PostJobModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedJob(null);
        }} 
        onJobPosted={fetchJobs} 
        editJob={selectedJob}
        isAdmin={isAdmin}
      />
      
      <JobDetailModal />
      
      {!isAdmin && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <Link to="/admin-login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ShieldAlert size={16} />
              <span>Admin Login</span>
            </motion.button>
          </Link>
        </div>
      )}

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Current Openings</h2>
            <p className="text-xl text-gray-600">Find your next opportunity with us</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
            <div className="relative flex-grow w-full">
              <input type="text" placeholder="Search job titles..." className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <select 
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-full md:w-auto"
            >
              <option value="All">All Departments</option>
              {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
            </select>
            {isAdmin && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-auto flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
              >
                <PlusCircle size={20} />
                <span>Post New Job</span>
              </motion.button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {filteredJobs.length > 0 ? filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`p-6 flex flex-col md:flex-row justify-between items-center ${index < filteredJobs.length - 1 ? 'border-b' : ''} hover:bg-gray-50 transition-colors duration-200 cursor-pointer`}
                  onClick={() => {
                    if (!isAdmin) {
                      setViewingJob(job);
                      setIsDetailModalOpen(true);
                    }
                  }}
                >
                  <div>
                    <h3 className="text-xl font-semibold text-blue-600 hover:underline">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-600 mt-2">
                      <span className="flex items-center gap-2"><Briefcase size={16} /> {job.department}</span>
                      <span className="flex items-center gap-2"><MapPin size={16} /> {job.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{job.type}</span>
                    {isAdmin ? (
                      <motion.button 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }} 
                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedJob(job);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit size={18} className="mr-2" />
                        Edit Job
                      </motion.button>
                    ) : (
                      <Link to="/contact">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                          Apply Now
                        </motion.button>
                      </Link>
                    )}
                  </div>
                </motion.div>
              )) : (
                <div className="text-center p-12 text-gray-500">
                  <p>No job openings found. Please check back later.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Careers;
