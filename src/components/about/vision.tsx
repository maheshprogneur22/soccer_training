import Image from "next/image";
import coach1 from "@/assets/soccer-1.webp";
import coach2 from "@/assets/soccee-2.jpg";
import coach3 from "@/assets/book.jpg";

export default function Vision() {
  const coaches = [
    {
      image: coach1,
      title: "Soccer, much more than a sport",
      description:
        "Soccer brings children together across backgrounds, teaching teamwork, perseverance, and respect. At Playse, we believe in the game’s power to inspire, shape character, and forge lifelong friendships.",},
    {
      image: coach2,
      title: "Soccer Sessions That Inspire",
      description:
        "Our sessions go beyond drills—they motivate young players to grow, push their limits, and develop a lasting love for soccer. Each practice blends skill-building, tactical understanding, and teamwork in a fun and encouraging environment.",},
   
  ];

  return (
    <section className="py-20 font-poppins bg-gradient-to-r from-[#f8fafc] to-[#e0f2f1]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto px-6 mb-16">
        <span className="inline-block rounded-2xl border border-gray-400 px-4 py-1 text-lg font-medium mb-4">
          Our Vision
        </span>
        <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          The  Kickster Origins
        </h3>
        <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
         At Kickster, our vision is to make soccer exciting for every child. We want to be the go-to place where expert coaches and young players come together to learn, play, and enjoy the game to the fullest.
        </p>
      </div>

      
      <section className="flex flex-col gap-24 px-6">
        {coaches.map((coach, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-between max-w-6xl mx-auto gap-10 md:flex-row ${
              index % 2 === 1 ? "md:flex-row-reverse" : ""
            } transform transition-all duration-500 hover:scale-105`}
          >
       
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-4">
                {coach.title}
              </h2>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                {coach.description}
              </p>
            </div>

         
            <div className="flex-1 flex justify-center">
              <div className="relative w-80 h-80 md:w-100 md:h-80 rounded-2xl overflow-hidden shadow-5xl hover:shadow-purple-500/40 transition-shadow duration-500">
                <Image src={coach.image} alt={coach.title} fill className="object-cover" />
              </div>
            </div>
          </div>
        ))}
      </section>
    </section>
  );
}
