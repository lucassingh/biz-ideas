import { Star } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { VerticalMarquee, type VerticalMarqueeItem } from "@/components/ui/VerticalMarquee";

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    id: "david",
    quote:
      "We didn't just get a software vendor — we got a strategic technology partner that understood our business goals and built AI solutions that actually move the needle.",
    name: "David Vargas",
    role: "COO",
    company: "MedCore Health Systems",
    avatar: "/avatars/avatar-2.png",
  },
  {
    id: "marcus",
    quote:
      "Our support queue used to be forty tabs and a prayer. Now three BGenAI agents triage everything before a human even looks at it.",
    name: "Marcus Bell",
    role: "Head of Operations",
    company: "Fenwick Logistics",
    avatar: "/avatars/avatar-4.png",
  },
  {
    id: "jason",
    quote: "We scoped a six-month automation build. BizIdeas shipped the first working agent in eleven days.",
    name: "Jason Miller",
    role: "Founder",
    company: "Lumen Analytics",
    avatar: "/avatars/avatar-5.png",
  },
  {
    id: "connor",
    quote: "I've reviewed a dozen AI vendors this year. This is the only one whose demo matched what actually shipped.",
    name: "Connor Wells",
    role: "VP Engineering",
    company: "Northbridge Capital",
    avatar: "/avatars/avatar-7.png",
  },
  {
    id: "julian",
    quote: "The ODIS workflow caught a compliance gap our own audit missed. That alone paid for the platform.",
    name: "Julian Cross",
    role: "Product Lead",
    company: "Fieldnote Co.",
    avatar: "/avatars/avatar-9.png",
  },
  {
    id: "rachel",
    quote:
      "BTrAIn turned our onboarding deck into an actual course — voice, quizzes, everything. New hires stopped asking the same five questions.",
    name: "Rachel Simmons",
    role: "Operations Director",
    company: "Bright Path Clinics",
    avatar: "/avatars/avatar-1.png",
  },
  {
    id: "emily",
    quote: "Every automation we asked for, they'd already thought of a better version.",
    name: "Emily Carter",
    role: "Head of Growth",
    company: "Verve Media",
    avatar: "/avatars/avatar-3.png",
  },
  {
    id: "hannah",
    quote: "I was skeptical about voice AI answering client calls. Three callers asked to book a second meeting with 'him.'",
    name: "Hannah Reed",
    role: "Founder",
    company: "Reed & Co. Consulting",
    avatar: "/avatars/avatar-6.png",
  },
  {
    id: "claire",
    quote: "We didn't replace anyone. We just stopped hiring for the parts of the job nobody wanted to do.",
    name: "Claire Whitman",
    role: "COO",
    company: "Alderly Group",
    avatar: "/avatars/avatar-8.png",
  },
  {
    id: "sophie",
    quote: "Support tickets are down 40%. My team finally has time to look at the ones that matter.",
    name: "Sophie Bennett",
    role: "VP Customer Success",
    company: "Vantage Retail",
    avatar: "/avatars/avatar-10.png",
  },
];

const columnA = testimonials.filter((_, i) => i % 2 === 0);
const columnB = testimonials.filter((_, i) => i % 2 === 1);

function TestimonialCard({ quote, name, role, company, avatar }: Testimonial) {
  return (
    <div className="rounded-2xl bg-light p-6 shadow-[0_6px_16px_rgba(247,93,0,0.1)]">
      <p className="text-[0.92rem] leading-relaxed text-dark/80">&ldquo;{quote}&rdquo;</p>
      <div className="mt-5 flex items-center gap-3">
        <img
          src={avatar}
          alt=""
          width={40}
          height={40}
          loading="lazy"
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0">
          <div className="text-[0.86rem] font-semibold text-dark">{name}</div>
          <div className="truncate text-[0.76rem] text-dark/55">
            {role} · {company}
          </div>
        </div>
      </div>
    </div>
  );
}

function toMarqueeItems(list: Testimonial[]): VerticalMarqueeItem[] {
  return list.map((t) => ({ id: t.id, content: <TestimonialCard {...t} /> }));
}

const marqueeItemsA = toMarqueeItems(columnA);
const marqueeItemsB = toMarqueeItems(columnB);
const marqueeItemsAll = toMarqueeItems(testimonials);

export function Testimonials() {
  return (
    <div className="overflow-hidden bg-main-bg px-6 py-20 sm:px-8 md:py-28">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[400px_1fr] lg:items-center lg:gap-16">
        <Reveal>
          <h2 className="text-[clamp(2rem,4vw,2.6rem)] font-bold leading-[1.1] text-ink">
            Feedback we never
            <br />
            had to ask for.
          </h2>
          <p className="mt-5 max-w-[420px] text-[1.02rem] leading-relaxed text-dark/60">
            Across BGenAI, BTrAIn and ODIS, these are the lines clients drop into calls and follow-up emails —
            unprompted, unedited, straight from the thread.
          </p>
          <div className="mt-6 flex items-center gap-2.5">
            <div className="flex gap-0.5 text-accent" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="h-4 w-4" fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <span className="text-[0.92rem] font-semibold text-dark">4.9</span>
            <span className="text-[0.85rem] text-dark/50">· Rated by 30+ enterprise teams</span>
          </div>
        </Reveal>

        <div className="relative h-[560px] sm:h-[620px]">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-main-bg to-transparent sm:h-28" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-main-bg to-transparent sm:h-28" />

          <div className="hidden h-full grid-cols-2 gap-5 sm:grid">
            <VerticalMarquee items={marqueeItemsA} direction="up" speed={22} gap={20} className="h-full" />
            <VerticalMarquee items={marqueeItemsB} direction="down" speed={22} gap={20} className="h-full" />
          </div>

          <div className="h-full sm:hidden">
            <VerticalMarquee items={marqueeItemsAll} direction="up" speed={22} gap={20} className="h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
