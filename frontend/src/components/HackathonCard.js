// src/components/HackathonCard.js
import React from 'react';
import { Card, CardHeader, CardBody, CardFooter } from './shadcn/Card';
import { Button } from './shadcn/Button';
import { FiStar, FiStar as FiStarFilled } from 'react-icons/fi'; // Updated import
import PropTypes from 'prop-types'; // If you use PropTypes for type checking

const HackathonCard = ({ hackathon, onFeatureToggle }) => {
  const { source, featured } = hackathon;

  const renderDetails = () => {
    switch (source) {
      case 'Devpost':
        return (
          <>
            <p className="text-gray-600">{hackathon.description || 'No description available.'}</p>
            <div className="text-sm text-gray-500">
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
            <div className="text-sm text-gray-500">
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
            <div className="text-gray-600">Institution: {hackathon.institution || 'N/A'}</div>
            <div className="text-sm text-gray-500">
              <span>Prize: {hackathon.prize || 'N/A'}</span>
              <br />
              <span>Days Left: {hackathon.days_left || 'N/A'}</span>
            </div>
          </>
        );
      case 'Hack2skill':
        return (
          <>
            <p className="text-gray-600">{hackathon.description || 'No description available.'}</p>
            <div className="text-sm text-gray-500">
              <span>Register Before: {hackathon.register_before || 'N/A'}</span>
              <br />
              <span>Mode: {hackathon.mode || 'N/A'}</span>
            </div>
          </>
        );
      default:
        return <p className="text-gray-500">No details available.</p>;
    }
  };

  return (
    <Card className="relative shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl bg-white">
      {featured && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 text-xs rounded">
          Featured
        </div>
      )}
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-800">{hackathon.title}</h2>
      </CardHeader>
      <CardBody>{renderDetails()}</CardBody>
      <CardFooter className="flex justify-between items-center">
        <Button
          variant="primary"
          className="flex items-center bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded hover:scale-105 transition-transform"
          onClick={() => onFeatureToggle(hackathon.id, featured)}
        >
          {featured ? <FiStarFilled className="mr-2" /> : <FiStar className="mr-2" />} {featured ? 'Unfeature' : 'Feature'}
        </Button>
        <a
          href={hackathon.registration_link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          Register Here
        </a>
      </CardFooter>
    </Card>
  );
};

HackathonCard.propTypes = {
  hackathon: PropTypes.object.isRequired,
  onFeatureToggle: PropTypes.func.isRequired,
};

export default HackathonCard;