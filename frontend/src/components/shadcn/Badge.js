import React from 'react';
import { Badge } from 'shadcn-ui';

const HackathonTile = ({ title, description, platforms }) => {
  return (
    <div className="hackathon-tile p-4 border border-gray-200 rounded-md shadow-sm">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <div className="platform-tags flex flex-wrap gap-2 mt-2">
        {platforms.map((platform) => (
          <Badge key={platform} className="capitalize">
            {platform}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default HackathonTile;