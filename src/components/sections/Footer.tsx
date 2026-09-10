import { LogoMarkOutline } from "@/components/Logo";
import { LinkedinIcon } from "@/components/icons/LinkedinIcon";
import { XIcon } from "@/components/icons/XIcon";
import { YoutubeIcon } from "@/components/icons/YoutubeIcon";

const footerColumns = [
  {
    title: "Services",
    links: ["AI Agents", "Automation", "Software Dev", "IT Outsourcing", "Web3"],
  },
  {
    title: "Products",
    links: ["BGenAI Evolution", "BTrAIn", "ODIS", "Voice AI"],
  },
];

const companyLinks = [
  { label: "About Us", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Bizit Global ↗", href: "https://bizitglobal.com", external: true },
];

const socials = [
  { label: "LinkedIn", href: "#", Icon: LinkedinIcon },
  { label: "X", href: "#", Icon: XIcon },
  { label: "YouTube", href: "#", Icon: YoutubeIcon },
];

export function Footer() {
  return (
    <footer className="bg-main-bg">
      <div className="mx-auto max-w-[1200px] px-6 py-16 sm:px-8 md:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-12">
          <div>
            <LogoMarkOutline className="mb-10 h-52 w-auto text-primary" />
            <p className="max-w-[280px] text-[0.88rem] leading-relaxed text-dark/55">
              Official US Partner of Bizit Global. Bringing enterprise AI and
              digital transformation solutions to American businesses.
            </p>
          </div>

          {footerColumns.map(({ title, links }) => (
            <div key={title}>
              <h3 className="mb-5 text-[0.8rem] font-bold uppercase tracking-[0.1em] text-dark/40">
                {title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {links.map((label) => (
                  <li key={label}>
                    <a
                      href="#"
                      className="text-[0.9rem] text-dark/65 transition-colors hover:text-dark"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mb-5 text-[0.8rem] font-bold uppercase tracking-[0.1em] text-dark/40">
              Company
            </h3>
            <ul className="flex flex-col gap-2.5">
              {companyLinks.map(({ label, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-[0.9rem] text-dark/65 transition-colors hover:text-dark"
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-5 border-t border-dark/8 pt-8 sm:flex-row sm:justify-between">
          <p className="text-[0.82rem] text-dark/45">
            © 2026 BizIdeas+ · An Official Bizit Global US Partner · Miami, FL
          </p>
          <div className="flex gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                title={label}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-dark/10 text-dark/50 transition-colors duration-200 hover:border-primary/30 hover:bg-primary/[0.05] hover:text-primary"
              >
                <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
