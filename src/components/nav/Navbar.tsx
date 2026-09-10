import { LogoFull } from "@/components/Logo";
import CardNav, { type CardNavItem } from "./CardNav";

const items: CardNavItem[] = [
  {
    label: "Services",
    bgColor: "var(--color-primary)",
    textColor: "var(--color-light)",
    links: [{ label: "What We Do", href: "#services", ariaLabel: "Go to Services section" }],
  },
  {
    label: "Products",
    bgColor: "var(--color-secondary)",
    textColor: "var(--color-light)",
    links: [{ label: "Our Products", href: "#products", ariaLabel: "Go to Products section" }],
  },
  {
    label: "About",
    bgColor: "var(--color-accent)",
    textColor: "var(--color-light)",
    links: [{ label: "How We Work", href: "#about", ariaLabel: "Go to About section" }],
  },
];

export function Navbar() {
  return (
    <header>
      <CardNav
        logo={<LogoFull className="h-6 w-auto text-primary md:h-7" />}
        items={items}
        ctaLabel="Book a Call →"
        ctaHref="#contact"
        baseColor="var(--color-main-bg)"
        scrolledColor="var(--color-light)"
        menuColor="var(--color-primary)"
        ctaClassName="bg-primary text-light hover:bg-secondary"
      />
    </header>
  );
}
