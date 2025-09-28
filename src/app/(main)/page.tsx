
import React from "react";
import Link from "next/link";
import Image from "next/image";
import heroImage from "@/assets/soccer.jpg";
import social from "@/assets/socialization.jpg"
import plays from "@/assets/plays.jpg"
import Respect from "@/assets/Respect.png"
import Health from "@/assets/health.webp"
import CoachesSection from "@/components/home/CoachesSection";
import AboutSection from "@/components/home/AboutSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import Navbar from "@/components/homenavbar/navbar";

const cardsData = [
  {
    image: social,
    heading: "Socialization Through Soccer",
    subheading: "Soccer is more than a game—it’s a way for kids to stay fit, make friends, and develop confidence in a fun, supportive environment.",
  },
  {
    image: plays,
    heading: "The  Kickster Method",
    subheading: "Our mission is simple: help children grow as soccer players and as well-rounded individuals. The Kickster Method supports personal and athletic development at every stage.",
  },
  {
    image: Respect,
    heading: "Learning Respect Through Soccer",
    subheading: "Kickster players learn life lessons through soccer, embracing respect for the game and everyone around them.",
  },
  {
    image: Health,
    heading: "Health",
    subheading: "At Kickster, soccer supports physical health, mental balance, and a love for an active lifestyle.",
  },
];


const CardGrid = ({cards}: {cards: typeof cardsData}) => (
  <div className="container mx-auto px-4 py-12">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center text-center"
        >
          <Image
            src={card.image}
            alt={card.heading}
            width={300}
            height={200}
            className="w-full h-48 object-cover rounded-xl mb-4"
          />
          <h3 className="text-xl font-bold text-gray-900 mb-2">{card.heading}</h3>
          <p className="text-gray-700">{card.subheading}</p>
        </div>
      ))}
    </div>
  </div>
);

const PlaysePage: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <div className="relative flex flex-col items-center justify-center text-white h-[90vh] w-full">
          <div
            className="absolute top-0 left-0 w-full"
            style={{height: "100%", backgroundColor: "#091427ff", zIndex: 0}}
          ></div>

          <div className="relative z-10 flex flex-col items-center text-center px-6">
            <div className="mb-4">
              <span className="rounded-2xl border border-gray-200 px-3 py-1 text-lg font-medium">
                Kickster
              </span>
            </div>

            <h1 className="text-7xl sm:text-5xl font-extrabold leading-tight">
              <span className="relative">
                Soccer Training That Brings Results
                <span className="absolute left-0 -bottom-1 h-2 w-full bg-purple-800 rounded"></span>
              </span>
              <br />
              near you
            </h1>

            <p className="mt-4 text-base sm:text-lg text-gray-200 max-w-3xl">
              Level up your game with Kickster ! Enjoy exciting soccer sessions guided by certified coaches nearby.
            </p>

            <div className="mt-6 flex gap-4">
              <Link href="/about" >
                <button className="rounded-2xl bg-gray-200 px-5 py-2 text-sm font-medium text-gray-900 shadow hover:bg-gray-300 transition">
                  Explore  Kickster
                </button>
              </Link>
              <Link
                href="/components/auth"
                className="rounded-2xl bg-teal-500 px-5 py-2 text-sm font-medium text-white shadow hover:bg-teal-600 transition inline-block text-center"
              >
                Subscribe to Kickster
              </Link>

            </div>
          </div>
        </div>

        {/* Image*/}
        <div className="relative bg-white text-gray-900 flex flex-col items-center py-16 px-6">
          <div
            className="absolute top-0 left-0 w-full"
            style={{
              height: "50%",
              backgroundColor: "#091427ff",
              borderBottomLeftRadius: "50% 20%",
              borderBottomRightRadius: "50% 20%",
              zIndex: 0,
            }}
          ></div>

          <div className="relative z-10 w-full max-w-4xl mt-[-90px]">
            <Image
              src={heroImage}
              alt="Soccer Player"
              width={800}
              height={400}
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>


        <div className="mt-6 flex flex-col items-center text-center gap-4 px-6">
          <span className="rounded-2xl border border-gray-400 px-3 py-1 text-lg font-medium">
            Founders
          </span>

          <h3 className="text-4xl font-bold text-gray-900">Our Leadership Team</h3>

          <p className="mt-2 text-base sm:text-lg max-w-3xl text-gray-900">
            At Kickster, world champion Blaise Matuidi and former Gunner Kieran Gibbs bring their professional experience and love for the game to every detail of what we do. Their creativity and innovation shape the future of soccer training for the next generation.        </p>
        </div>
        <CardGrid cards={cardsData} />

        <div className="mt-6 flex flex-col items-center text-center gap-4 px-6">
          <span className="rounded-2xl border border-gray-400 px-3 py-1 text-lg font-medium">
            Sign Up
          </span>

          <h3 className="text-5xl font-bold text-gray-900">Fast, easy, and secure booking for kids’ sessions.</h3>

          <p className="mt-2 text-base sm:text-lg max-w-3xl text-gray-900">

            A  Kickster session is a dynamic and rewarding soccer experience, designed to maximize both fun and skill development for young players.
          </p>
        </div>
        <CoachesSection />
        <AboutSection />
        <TestimonialSection />
      </div>
    </>
  );
};

export default PlaysePage;
