import Image from 'next/image';
import { Link } from '@/navigation';
import telegram from '@/assets/logos/telegram.png';
import gmail from '@/assets/logos/gmail.png';

export const Contacts = () => {
  return (
    <div className="flex gap-2 p-4 pb-0">
      {contacts.map(({ icon, ariaLabel, link }, index) => (
        <Link key={index} href={link} aria-label={ariaLabel}>
          <div className="rounded-lg border bg-card p-2 text-card-foreground shadow-sm">
            {icon}
          </div>
        </Link>
      ))}
    </div>
  );
};

const contacts = [
  {
    icon: <i className="devicon-linkedin-plain-wordmark colored text-8xl" />,
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
