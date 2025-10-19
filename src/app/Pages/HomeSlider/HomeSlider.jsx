'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Import your images
import IMG1 from '../../../app/assets/img1.jpeg';
import IMG2 from '../../../app/assets/img2.jpeg';
import IMG3 from '../../../app/assets/img3.jpeg';
import IMG4 from '../../../app/assets/img8.png';

const HomeSlider = () => {
    const images = [
        {
            src: IMG1,
            alt: "Learn Anytime, Anywhere"
        },
        {
            src: IMG2,
            alt: "Expert Instructors, Quality Education"
        },
        {
            src: IMG3,
            alt: "Interactive Learning Experience"
        },
        {
            src: IMG4,
            alt: "Join Our Virtual Classroom"
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    // Autoplay logic - 3.5 seconds interval
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
        }, 3500);
        return () => clearInterval(interval);
    }, [images.length]);

    // Handle dot navigation click
    const handleDotClick = (index) => {
        setCurrentSlide(index);
    };

    // Handle arrow navigation click
    const handleArrowClick = (direction) => {
        if (direction === 'prev') {
            setCurrentSlide((prevSlide) => (prevSlide - 1 + images.length) % images.length);
        } else {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
        }
    };

    return (
        <div className="p-2 md:p-4">
            {/* Main Carousel Container */}
            <div className="relative w-full lg:h-[540px] rounded-2xl overflow-hidden shadow-xl">
                
                {/* Slides Container */}
                <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[600px] xl:h-[600px]">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                                currentSlide === index ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            <Image
                                src={image.src}
                                className="object-cover mx-auto w-full lg:h-screen "
                                alt={image.alt}
                                priority={index === 0}
                                quality={90}   
                            />
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows - Hidden on mobile, visible on larger screens */}
                <div className="  flex absolute left-4 right-4 top-1/2 transform -translate-y-1/2 justify-between">
                    {/* Previous Button */}
                    <button
                        className="btn btn-circle glass text-black hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-white/30 "
                        onClick={() => handleArrowClick('prev')}
                        aria-label="Previous slide"
                    >
                        ❮
                    </button>
                    
                    {/* Next Button */}
                    <button
                        className="btn btn-circle glass text-black hover:bg-gray-200 transition-all duration-300 backdrop-blur-md border border-black/30"
                        onClick={() => handleArrowClick('next')}
                        aria-label="Next slide"
                    >
                        ❯
                    </button>
                </div>

                {/* Dots Indicator - Always visible but smaller on mobile */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                    {images.map((_, dotIndex) => (
                        <button
                            key={`dot-${dotIndex}`}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                currentSlide === dotIndex 
                                    ? 'bg-blue-400 w-6 h-2 scale-125' 
                                    : 'bg-white/50 hover:bg-white/80'
                            }`}
                            onClick={() => handleDotClick(dotIndex)}
                            aria-label={`Go to slide ${dotIndex + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomeSlider;