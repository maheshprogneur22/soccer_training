import Image, { StaticImageData } from "next/image";

interface CoachCardProps {
  image: StaticImageData;
  name: string;
  description: string;
}

const CoachCard: React.FC<CoachCardProps> = ({ image, name, description }) => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-100 rounded-2xl shadow-xl p-8 text-center flex flex-col items-center w-72 transition-transform duration-300 hover:scale-105 hover:shadow-2xl font-[Poppins]">
   
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-teal-500 shadow-md mb-6">
        <Image
          src={image}
          alt={name}
          width={128}
          height={128}
          className="object-cover w-full h-full"
        />
      </div>

    
      <h3 className="text-3xl font-extrabold bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent tracking-wide">
        {name}
      </h3>

      {/* Divider */}
      <div className="w-15 h-8 bg-teal-400 rounded-full my-3"></div>

    
      <p className="text-2xl text-gray-700 leading-relaxed max-w-xs">
        {description}
      </p>
    </div>
  );
};

export default CoachCard;
