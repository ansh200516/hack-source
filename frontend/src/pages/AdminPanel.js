import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../contexts/AuthContext';
import { Button } from '../components/shadcn/Button';
import { UpdateIcon, StarIcon, StarFilledIcon } from '@radix-ui/react-icons';
import Modal from '../components/Modal';
import { Card, CardHeader, CardBody, CardFooter } from '../components/shadcn/Card';

const AdminPanel = () => {
  const { user, token } = useContext(AuthContext);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    setLoading(true);
    try {
      const response = await api.get('/hackathons');
      const hackathonsWithSource = response.data.map((hackathon) => ({
        ...hackathon,
        source: hackathon.source || 'Unknown',
      }));
      setHackathons(hackathonsWithSource);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hackathons:', error);
      setLoading(false);
    }
  };

  const handleFeatureToggle = async (id, currentStatus) => {
    try {
      const response = await api.post(`/hackathons/${id}/toggle-featured`);
      if (response.status === 200) {
        setHackathons((prevHackathons) =>
          prevHackathons.map((hack) =>
            hack.id === id ? { ...hack, featured: response.data.featured } : hack
          )
        );
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const openModal = (hackathon) => {
    setSelectedHackathon(hackathon);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedHackathon(null);
    setIsModalOpen(false);
  };

  const renderCardDetails = (hackathon) => {
    switch (hackathon.source) {
      case 'Devpost':
        return (
          <>
            <p className="text-gray-300">{hackathon.description || 'No description available.'}</p>
            <div className="text-sm text-gray-400">
              <span>Deadline: {hackathon.deadline || 'N/A'}</span>
              <br />
              <span>Prize: {hackathon.prize || 'N/A'}</span>
              <br />
              <span>Location: {hackathon.location || 'N/A'}</span>
            </div>
          </>
        );
      case 'Devfolio':
        return (
          <>
            <div className="text-sm text-gray-400">
              <span>Prize: {hackathon.prize || 'N/A'}</span>
              <br />
              <span>Start Date: {hackathon.start_date || 'N/A'}</span>
              <br />
              <span>Location: {hackathon.location || 'N/A'}</span>
            </div>
          </>
        );
      case 'Unstop':
        return (
          <>
            <div className="text-gray-300">Institution: {hackathon.institution || 'N/A'}</div>
            <div className="text-sm text-gray-400">
              <span>Prize: {hackathon.prize || 'N/A'}</span>
              <br />
              <span>Days Left: {hackathon.days_left || 'N/A'}</span>
            </div>
          </>
        );
      case 'Hack2skill':
        return (
          <>
            <p className="text-gray-300">{hackathon.description || 'No description available.'}</p>
            <div className="text-sm text-gray-400">
              <span>Register Before: {hackathon.deadline || 'N/A'}</span>
              <br />
              <span>Mode: {hackathon.location || 'N/A'}</span>
            </div>
          </>
        );
      default:
        return <p>No data available for this source.</p>;
    }
  };

  // Filter and sort hackathons
  const filteredHackathons = hackathons
    .filter((hackathon) =>
      (hackathon.title || hackathon.name)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Featured hackathons first
      if (a.featured === b.featured) {
        return 0;
      } else if (a.featured) {
        return -1;
      } else {
        return 1;
      }
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <UpdateIcon className="animate-spin h-10 w-10 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Panel</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search hackathons by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Refresh Button */}
      <Button onClick={fetchHackathons} className="mb-6 flex items-center">
        <UpdateIcon className="mr-2" />
        Refresh
      </Button>

      {/* Hackathons List */}
      {filteredHackathons.length === 0 ? (
        <p className="text-center text-gray-500">No hackathons available.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredHackathons.map((hackathon) => (
            <Card
              key={hackathon.id}
              className={`shadow-lg dark:bg-gray-800 bg-white rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl ${
                hackathon.featured
                  ? 'border-4 border-yellow-400'
                  : 'bg-gradient-to-r from-pink-500 to-purple-500 dark:from-gray-700 dark:to-gray-900'
              }`}
            >
              <CardHeader>
                <h2 className="text-2xl font-semibold text-white">
                  {hackathon.title || hackathon.name}
                </h2>
              </CardHeader>
              <CardBody>
                {renderCardDetails(hackathon)}
              </CardBody>
              <CardFooter className="flex justify-between items-center">
              <Button
                variant="primary"
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-4 py-2 rounded transition-transform transform hover:scale-105"
                onClick={() => openModal(hackathon)}
              >
                View Details
              </Button>
                <Button
                  onClick={() => handleFeatureToggle(hackathon.id, hackathon.featured)}
                  className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-2 py-1 rounded transition-transform transform hover:scale-105"
                >
                  {hackathon.featured ? (
                    <StarFilledIcon className="mr-1" />
                  ) : (
                    <StarIcon className="mr-1" />
                  )}
                  {hackathon.featured ? 'Unfeature' : 'Feature'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {selectedHackathon && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="p-6 dark:bg-gray-800 bg-white rounded-lg shadow-lg text-gray-900 dark:text-gray-200">
            <h2 className="text-3xl font-bold mb-4 text-primary dark:text-white">
              {selectedHackathon.title || selectedHackathon.name}
            </h2>
            <p className="mb-4 leading-relaxed">
              {selectedHackathon.description || 'No description available.'}
            </p>
            <a
              href={selectedHackathon.link || selectedHackathon.registration_link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-4 py-2 rounded hover:scale-105 transition-transform"
            >
              Register Now
            </a>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminPanel;