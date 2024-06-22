'use client'; // https://github.com/shadcn-ui/ui/issues/1918

// eslint-disable-next-line no-restricted-imports
import Link from 'next/link';
import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { LocaleSelect, LocaleSelectProps } from '@/components/LocaleSelect';
import { githubUrl } from '@/const';

interface HeaderProps {
  title: string;
  anchors: { title: string; href: string }[];
  githubButtonText: string;
  localeSelectProps: LocaleSelectProps;
}

export const Header = ({
  title,
  anchors,
  githubButtonText,
  localeSelectProps,
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between space-x-4 sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link
            href="/"
            prefetch={false}
            className="flex items-center space-x-2"
            aria-label={title}
          >
            <h1 className="hidden font-bold sm:inline-block">{title}</h1>
          </Link>
        </div>
        <div className="flex items-center">
          {anchors?.length !== 0 && (
            <NavigationMenu>
              <NavigationMenuList>
                {anchors.map(({ title, href }, index) => (
                  <NavigationMenuItem key={index}>
                    <Link href={href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        {title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>
        <div className="flex items-center">
          <div className="flex items-center space-x-1">
            <Button variant="outline" asChild>
              <Link href={githubUrl} target="_blank" rel="noreferrer">
                <Github className="mr-2 h-4 w-4" /> {githubButtonText}
              </Link>
            </Button>
            <LocaleSelect {...localeSelectProps} />
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};
