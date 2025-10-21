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

export default function Home() {
  return (
    <div>
      <HomeSLider/>
      <Category/>
      <FeaturedCourses/>
      <OfferBanner/>
      <WhyChooseUs/>
      <TestimonialSection/>
      {/* <CallToAction/> */}
      <Faq/>
      
    </div>
  )
}
