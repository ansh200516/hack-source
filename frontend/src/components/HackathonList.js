import React, { useEffect, useState, useContext } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from './shadcn/Card';
import { Button } from './shadcn/Button';
import Modal from './Modal';
import axios from 'axios';
import { UpdateIcon, StarIcon, StarFilledIcon } from '@radix-ui/react-icons'; // Correct Radix Icons
import PropTypes from 'prop-types';
import { AuthContext } from '../contexts/AuthContext';

const HackathonList = () => {
  const { user, token } = useContext(AuthContext);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [source, setSource] = useState('Devpost'); // Track the current source
  const [searchQuery, setSearchQuery] = useState('');

  const fetchHackathons = async (source) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5213/api/hackathons/${source}`);
      setHackathons(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hackathons:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathons(source);
  }, [source]);

  const handleSourceChange = (newSource) => {
    setSource(newSource);
    setSearchQuery(''); // Reset search query when source changes
  };

  const openModal = (hackathon) => {
    setSelectedHackathon(hackathon);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedHackathon(null);
    setIsModalOpen(false);
  };

  const handleFeatureToggle = async (id, currentStatus) => {
    try {
      const response = await axios.post(
        `http://localhost:5213/api/hackathons/${id}/toggle-featured`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        // Update the local state
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

  const renderCardDetails = (hackathon) => {
    switch (source) {
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
        <UpdateIcon className="animate-spin h-10 w-10 text-white" />      
      </div>
    );
  }

  if (filteredHackathons.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-400">No hackathons found for {source}.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-pink-700 to-purple-700 bg-clip-text text-transparent">
        AI/ML Hackathons
      </h1>
      {/* Buttons to switch between hackathon sources */}
      <div className="flex justify-center space-x-4 mb-8">
        <Button variant="primary" onClick={() => handleSourceChange('Hack2skill')}>
          Hack2skill
        </Button>
        <Button variant="primary" onClick={() => handleSourceChange('Devfolio')}>
          Devfolio
        </Button>
        <Button variant="primary" onClick={() => handleSourceChange('Unstop')}>
          Unstop
        </Button>
        <Button variant="primary" onClick={() => handleSourceChange('Devpost')}>
          Devpost
        </Button>
      </div>
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
      {/* Hackathons List */}
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
              {/* Feature Toggle Button (Admin Only) */}
              {user && user.role === 'admin' && (
                <Button
                  variant="primary"
                  className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-2 py-1 rounded transition-transform transform hover:scale-105"
                  onClick={() => handleFeatureToggle(hackathon.id, hackathon.featured)}
                >
                  {hackathon.featured ? (
                    <StarFilledIcon className="mr-1" />
                  ) : (
                    <StarIcon className="mr-1" />
                  )}
                  {hackathon.featured ? 'Unfeature' : 'Feature'}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

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

HackathonList.propTypes = {
  // Define prop types if needed
};

export default HackathonList;