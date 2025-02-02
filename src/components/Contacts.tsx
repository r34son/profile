import Image from 'next/image';
import { Link } from '@/i18n/routing';
import linkedin from '@/assets/logos/linkedin.webp';
import telegram from '@/assets/logos/telegram.webp';
import gmail from '@/assets/logos/gmail.webp';

export const Contacts = () => {
  return (
    <div className="flex gap-2 p-4 pb-0">
      {contacts.map(({ icon, ariaLabel, link }, index) => (
        <Link key={index} href={link} aria-label={ariaLabel}>
          <div className="bg-card text-card-foreground rounded-lg border p-2 shadow-xs">
            {icon}
          </div>
        </Link>
      ))}
    </div>
  );
};

const contacts = [
  {
    icon: (
      <Image
        src={linkedin.src}
        alt="Linkedin"
        width={96}
        height={96}
        placeholder="blur"
        blurDataURL={linkedin.blurDataURL}
      />
    ),
    ariaLabel: 'Linkedin link',
    link: 'https://www.linkedin.com/in/r34s0n/',
  },
  {
    icon: (
      <Image
        src={gmail.src}
        alt="Gmail"
        width={96}
        height={96}
        placeholder="blur"
        blurDataURL={gmail.blurDataURL}
      />
    ),
    ariaLabel: 'Gmail link',
    link: 'mailto:seitasanov.yahub@gmail.com',
  },
  {
    icon: (
      <Image
        src={telegram.src}
        alt="Telegram"
        width={96}
        height={96}
        placeholder="blur"
        blurDataURL={telegram.blurDataURL}
      />
    ),
    ariaLabel: 'Telegram link',
    link: 'https://telegram.me/r34son',
  },
];
