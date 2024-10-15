// src/pages/LandingPage.js

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { Card, CardHeader, CardBody, CardFooter } from '../components/shadcn/Card';
import { ButtonPrimary } from '../components/shadcn/Button';
import { ArrowRightIcon } from '@radix-ui/react-icons'; // Radix Icon
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleCardClick = (destination) => {
    navigate(destination);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-900 p-8"> {/* Changed bg-gray-100 to bg-gray-900 */}
      <h1 className="text-5xl font-bold mb-20 text-center bg-gradient-to-r from-pink-700 to-purple-700 bg-clip-text text-transparent">
        Hackathons
      </h1>
      <div className="w-full max-w-2xl">
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          loop
        >
          {/* AI/ML Hackathons Card */}
          <SwiperSlide>
            <Card className="flex flex-col items-center p-8 bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow "> {/* Changed bg-white to bg-gray-800 */}
              <CardHeader>
                <h2 className="text-3xl font-semibold text-white">AI/ML Hackathons</h2> {/* Changed text-gray-800 to text-white */}
              </CardHeader>
              <CardBody className="mt-4">
                <p className="text-gray-300 text-center"> {/* Changed text-gray-600 to text-gray-300 */}
                  Explore the latest AI and Machine Learning hackathons. Enhance your skills and collaborate with like-minded individuals.
                </p>
              </CardBody>
              <CardFooter className="mt-6">
                <ButtonPrimary onClick={() => handleCardClick('/devpost')} className="flex items-center">
                  View Hackathons
                  <ArrowRightIcon className="ml-2" />
                </ButtonPrimary>
              </CardFooter>
            </Card>
          </SwiperSlide>

          {/* Coming Soon Card */}
          <SwiperSlide>
            <Card className="flex flex-col items-center p-8 bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow"> {/* Changed bg-white to bg-gray-800 */}
              <CardHeader>
                <h2 className="text-3xl font-semibold text-white">Coming Soon</h2> {/* Changed text-gray-800 to text-white */}
              </CardHeader>
              <CardBody className="mt-4">
                <p className="text-gray-300 text-center"> {/* Changed text-gray-600 to text-gray-300 */}
                  Stay tuned! More hackathon types will be available shortly. We're working hard to bring you the best opportunities.
                </p>
              </CardBody>
              <CardFooter className="mt-6">
                <ButtonPrimary disabled className="opacity-50 cursor-not-allowed">
                  Coming Soon
                </ButtonPrimary>
              </CardFooter>
            </Card>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default LandingPage;