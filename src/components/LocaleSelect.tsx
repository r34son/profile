import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Locales, locales } from '@/i18n';
import { Link } from '@/navigation';
import { Globe } from 'lucide-react';

export interface LocaleSelectProps {
  title: string;
  localeNames: Record<Locales, string>;
}

export const LocaleSelect = ({ title, localeNames }: LocaleSelectProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe />
          <span className="sr-only">{title}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[2rem]">
        {locales.map((locale) => (
          <DropdownMenuItem key={locale}>
            <Link href="/" locale={locale}>
              {localeNames[locale]}
            </Link>
            <span className="sr-only">{localeNames[locale]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
