import Image from "next/image";
import coach1 from "@/assets/coach.jpg";
import coach2 from "@/assets/profile-2.jpg";
import coach3 from "@/assets/book.jpg";

const CoachesSection = () => {
  const coaches = [
    {
      image: coach1,
      title: "Meet Our Coaches",
      description: "Kickster sessions are powered by expert coaches who bring professional-level skills, innovative methods, and a passion for developing young players.",
    },
    {
      image: coach2,
      title: "Get Started with Kickster",
      description: "Visit our app and create your child’s profile—just enter their name and date of birth to begin.",
    },
    {
      image: coach3,
      title: "Book Your Session",
      description: "Pick the session that best fits your child’s age group and location, confirm your spot, and get instant booking updates.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50 flex flex-col gap-24">
      {coaches.map((coach, index) => (
        <div
          key={index}
          className={`flex flex-col items-center justify-between max-w-6xl mx-auto gap-10 px-6 
          md:flex-row ${index % 2 === 1 ? "md:flex-row-reverse" : ""} transform transition-all duration-500 hover:scale-105`}
        >
         
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-purple-700 mb-4">{coach.title}</h2>
            <p className="text-gray-700 text-lg leading-relaxed">{coach.description}</p>
          </div>

          {/* Image*/}
          <div className="flex-1 flex justify-center">
            <div className="relative w-90 h-50 md:w-96 md:h-96 rounded-3xl overflow-hidden shadow-2xl hover:shadow-purple-500/40 transition-shadow duration-300">
              <Image
                src={coach.image}
                alt={coach.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default CoachesSection;
