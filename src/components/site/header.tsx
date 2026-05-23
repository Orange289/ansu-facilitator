import {Link} from "@/i18n/routing";
import {LanguageSwitcher} from "./language-switcher";
import {MobileMenu} from "./mobile-menu";
import {NavLinks} from "./nav-links";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link
          className="text-lg font-semibold leading-none tracking-[0.08em] text-ink transition-colors duration-300 hover:text-line"
          href="/"
        >
          Anya Ansu
        </Link>

        <nav className="hidden items-center gap-7 text-xs uppercase tracking-[0.16em] text-ink/66 lg:flex">
          <NavLinks />
        </nav>

        <div className="hidden lg:block">
          <LanguageSwitcher />
        </div>
        <MobileMenu />
      </div>
    </header>
  );
}
