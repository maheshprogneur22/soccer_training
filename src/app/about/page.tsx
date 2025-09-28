import Image from "next/image";
import playerImg from "@/assets/soccer.png";
import Vision from "@/components/about/vision";
import Story from "@/components/about/story";
import Navbar from "@/components/homenavbar/navbar";

export default function WhoWeAre() {
  return (
    <div>
      <Navbar />
      <section className="bg-gradient-to-r from-[#69b7b2] to-[#3a9d9a] py-20 mt-1 relative overflow-hidden ">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center px-6 ">
         
          <div>
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 relative">
              Who we are?
              <span className="block w-24 h-1 bg-purple-500 mt-4 rounded"></span>
            </h2>
            <p className="text-gray-800 leading-relaxed mb-8 max-w-lg text-lg md:text-xl">
              At Kickster, our mission is clear:{" "}
              <span className="font-semibold text-gray-900">
                to nurture young soccer talents.
              </span>{" "}
              We believe every child deserves high-quality training that not only
              boosts their sports skills but also deepens their love for the game.
              This training is a step towards{" "}
              <span className="font-bold text-gray-900">
                building self-confidence, enjoying sports, and surpassing personal
                limits.
              </span>
            </p>

            <div className="flex gap-4">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-400 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform">
                Create a Kickster Account
              </button>
            </div>
          </div>

          {/* Right Side Image*/}
          <div className="relative flex justify-center">
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
            <Image
              src={playerImg}
              alt="Soccer Player"
              width={600}
              height={600}
            />
          </div>

        </div>
      </section>
      <Vision />
      <Story />
    </div>

  );
}
