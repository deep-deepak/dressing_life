import { Link } from 'react-router-dom';
import { FacebookIcon, InstagramIcon, Logo, TwitterIcon, YoutubeIcon } from '@/components/common';
import { FOOTER_LINKS, SITE_CONFIG } from '@/constants/site';
import { Input } from '@/components/ui';

const SOCIAL_LINKS = [
  { icon: InstagramIcon, href: SITE_CONFIG.social.instagram, label: 'Instagram' },
  { icon: FacebookIcon, href: SITE_CONFIG.social.facebook, label: 'Facebook' },
  { icon: TwitterIcon, href: SITE_CONFIG.social.twitter, label: 'Twitter' },
  { icon: YoutubeIcon, href: SITE_CONFIG.social.youtube, label: 'YouTube' },
];

function FooterColumn({ title, links }: { title: string; links: { label: string; path: string }[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-display text-sm uppercase tracking-wider text-brand-white">{title}</h3>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.path} className="text-sm text-brand-gray-400 transition-colors hover:text-brand-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-brand-black text-brand-white">
      <div className="container-page grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Logo theme="dark" />
          <p className="max-w-sm text-sm text-brand-gray-400">{SITE_CONFIG.description}</p>
          <div className="flex items-center gap-3 pt-2">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex size-9 items-center justify-center border border-brand-charcoal text-brand-gray-300 transition-colors hover:border-brand-red-700 hover:text-brand-white"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <FooterColumn title="Shop" links={FOOTER_LINKS.shop} />
        <FooterColumn title="Company" links={FOOTER_LINKS.company} />
        <FooterColumn title="Account" links={FOOTER_LINKS.account} />
      </div>

      <div className="border-t border-brand-charcoal">
        <div className="container-page flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-sm items-center gap-2"
          >
            <Input type="email" placeholder="Enter your email" className="border-brand-charcoal bg-brand-charcoal text-brand-white placeholder:text-brand-gray-500" />
            <button
              type="submit"
              className="h-11 shrink-0 bg-brand-red-700 px-5 font-display text-xs uppercase tracking-wider text-brand-white hover:bg-brand-red-800"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-brand-gray-500">
            © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
