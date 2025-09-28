import Image, {StaticImageData} from "next/image";
import sarah from "@/assets/sarah.webp"
import david from "@/assets/david-2.jpg";
import emily from "@/assets/emily.avif";

interface Testimonial {
  name: string;
  feedback: string;
  image: StaticImageData; 
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    feedback:
      "Kickster has completely transformed my son’s game. The coaches are so supportive, and he’s more confident both on and off the field.",
    image: sarah,
  },
  {
    name: "David Carter",
    feedback:
      "We love how Playse combines fun with discipline. My daughter not only improved her soccer skills but also learned teamwork and respect.",
    image: david,
  },
  {
    name: "Emily Williams",
    feedback:
      "The sessions are engaging and full of energy. My child looks forward to every training day. Highly recommended!",
    image: emily,
  },
];

export default function TestimonialSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Parents Share Their Experience
        </h2>
        <p className="text-gray-600 mb-10">
          Hear from families who have experienced growth and joy through Kickster.
        </p>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >

              <Image
                src={t.image}
                alt={t.name}
                width={80}
                height={80}
                className="rounded-full mb-4 object-cover"
              />


              <p className="text-gray-700 italic mb-4">“{t.feedback}”</p>


              <h4 className="text-lg font-semibold text-gray-900">{t.name}</h4>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
