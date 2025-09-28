import Image from "next/image";
import storyImg from "@/assets/story.jpg"; 

export default function OurStory() {
  const milestones = [
    {
      year: "2018",
      title: "Humble Beginnings",
      description:
        "Kickster started as a small local initiative, bringing together a handful of young soccer enthusiasts.",
    },
    {
      year: "2020",
      title: "Expanding the Academy",
      description:
        "With growing demand, we expanded our coaching staff and started organizing weekly soccer sessions.",
    },
    {
      year: "2022",
      title: "Community Impact",
      description:
        "Our platform reached hundreds of children, fostering teamwork, discipline, and lifelong friendships.",
    },
    
  ];

  return (
    <section className="relative py-24 bg-gradient-to-r from-[#e0f2f1] to-[#f0f4f8] font-poppins overflow-hidden">
     
      <div className="text-center max-w-3xl mx-auto px-6 mb-16">
        <span className="inline-block rounded-2xl border border-gray-400 px-4 py-1 text-lg font-medium mb-4">
          Our Journey
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          From Passion to Kickster
        </h2>
        <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
          Every great journey starts with a dream. At Playse, our story is about nurturing young soccer talent, building confidence, and creating a community where children grow and thrive through the love of the game.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-16 items-start">
      
        <div className="flex-1 relative">
          <div className="absolute top-0 left-5 w-1 h-full bg-purple-300"></div>
          <div className="space-y-16">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative flex items-start">
             
                <div className="w-8 h-8 bg-purple-500 rounded-full z-10 flex-shrink-0 mt-1"></div>
                
              
                <div className="ml-8">
                  <h4 className="text-xl md:text-2xl font-bold text-purple-700">{milestone.year} - {milestone.title}</h4>
                  <p className="text-gray-700 mt-2 text-base md:text-lg">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/*  Image */}
        <div className="flex-1 relative w-full h-96 md:h-[450px] rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src={storyImg}
            alt="Our Story"
            fill
            className="object-cover"
          />
         
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-200/40 rounded-full blur-2xl"></div>
        </div>
      </div>
    </section>
  );
}
