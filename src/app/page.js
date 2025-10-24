'use client'
import React from 'react'
import HomeSLider from './Pages/HomeSlider/HomeSlider'
import Category from './Pages/Category/Category'
import Faq from './Pages/FaqSection/Faq'
import FeaturedCourses from './Pages/FeaturedCourses'
import OfferBanner from './Pages/OfferBanner/OfferBanner'
import WhyChooseUs from './Pages/WhyChooseUs/WhyChooseUs'
import TestimonialSection from './Pages/TestimonialSection/TestimonialSection'
import CallToAction from './Pages/TestimonialSection/CallToAction'
import AdvancedCustomPlayer from './Pages/VideoComponent/videoComponent'
import CustomYouTubePlayer from './Pages/VideoComponent/videoplayer'
import VideoPlayer from './Pages/VideoComponent/videoplayer'

export default function Home() {
  return (
    <div>
      <HomeSLider/>
      <Category/>
      <AdvancedCustomPlayer/>
      
      <FeaturedCourses/>
      <VideoPlayer/>
      <OfferBanner/>
      
      <WhyChooseUs/>
      <TestimonialSection/>
      {/* <CallToAction/> */}
      <Faq/>
      
    </div>
  )
}
