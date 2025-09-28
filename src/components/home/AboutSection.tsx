import React from "react";
import Link from "next/link";

const AboutSection = () => {
  return (
    <section className="bg-[#091427ff] text-white py-16 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">


        <div>
          <h2 className="text-3xl md:text-4xl font-bold leading-snug">
            Accessible Soccer Programs
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            At Kickster, our mission is to empower young soccer players to thrive. We believe every child deserves high-quality training that sharpens their skills while nurturing a genuine love for the game.
          </p>
        </div>


        <div>
          <Link href="/about">
            <button className="border border-white rounded-md px-4 py-2 mb-4 hover:bg-white hover:text-[#0A0E2D] transition">
              About Us
            </button>
          </Link>
          <p className="text-lg text-gray-300">
            At Kickster, we strive to create more than just opportunities to play—we create journeys. Soccer teaches more than skills; it builds confidence, resilience, and lasting friendships. Every practice is a step forward, every drill a challenge, and every game a celebration of growth and teamwork.
          </p>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div>
          <h3 className="text-5xl font-bold text-yellow-400">5000</h3>
          <p className="mt-2 text-gray-300">App users</p>
        </div>
        <div>
          <h3 className="text-5xl font-bold text-yellow-400">117</h3>
          <p className="mt-2 text-gray-300">Certified coaches</p>
        </div>
        <div>
          <h3 className="text-5xl font-bold text-yellow-400">80</h3>
          <p className="mt-2 text-gray-300">Available fields across the world</p>
        </div>
        <div>
          <h3 className="text-5xl font-bold text-yellow-400">50</h3>
          <p className="mt-2 text-gray-300">Cities across the world</p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
