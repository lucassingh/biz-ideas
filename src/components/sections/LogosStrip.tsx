import { LogoLoop, type LogoItem } from "@/components/ui/LogoLoop";
import { Reveal } from "@/components/ui/Reveal";

type Brand = {
  file: string;
  name: string;
  // Most marks fill their slot at the same visual weight under `contain`,
  // but this one's aspect ratio nearly matches the slot's, so it reads
  // noticeably larger than its neighbors unless scaled back down.
  scale?: number;
};

const brands: Brand[] = [
  { file: "odoo.svg", name: "Odoo" },
  { file: "elevenlabs.svg", name: "ElevenLabs" },
  { file: "btrain.svg", name: "BTrAIn" },
  { file: "qdis-mark.svg", name: "Qdis", scale: 0.8 },
  { file: "n8n.svg", name: "n8n" },
  { file: "bgenai.svg", name: "BGenAI" },
];

// Fixed slot so wildly different logo proportions (a 90px-tall wordmark next
// to a square mark) read as the same size — `contain` shrinks/centers each
// logo inside it instead of stretching every logo to the same height.
const LOGO_SLOT_WIDTH = 190;

function BrandMark({ file, name, scale = 1 }: Brand) {
  return (
    <span className="inline-flex items-center justify-center" style={{ width: LOGO_SLOT_WIDTH }}>
      <span
        aria-hidden="true"
        className="block w-full bg-logo-marquee"
        style={{
          height: "var(--logoloop-logoHeight)",
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          WebkitMaskImage: `url(/logos/${file})`,
          maskImage: `url(/logos/${file})`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
      <span className="sr-only">{name}</span>
    </span>
  );
}

const logoItems: LogoItem[] = brands.map((brand) => ({
  node: <BrandMark {...brand} />,
  ariaLabel: brand.name,
}));

export function LogosStrip() {
  return (
    <div id="partners" className="bg-main-bg">
      <Reveal className="mx-auto max-w-[1200px] px-6 py-16 sm:px-8 md:py-20">
        <h3 className="mb-14 text-center text-[1.65rem] font-semibold tracking-tight text-ink sm:mb-16 sm:text-[1.95rem]">
          Powered by the Bizit Global Technology Ecosystem
        </h3>
        <LogoLoop
          logos={logoItems}
          direction="right"
          speed={80}
          gap={100}
          logoHeight={90}
          fadeOut
          fadeOutColor="var(--color-main-bg)"
          ariaLabel="Technology partner logos"
        />
      </Reveal>
    </div>
  );
}
