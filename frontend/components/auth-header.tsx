'use client';

import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

const AuthHeader = () => {
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (lang: string) => {
    // Save language in cookie
    document.cookie = `NEXT_LOCALE=${lang}; path=/`;

    // Replace locale in path
    const newPath = `/${lang}${pathname.replace(/^\/(en|hi)/, '')}`;
    router.push(newPath);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom px-3 py-2">
      <div className="container-fluid">

        {/* Logo */}
        <div className="d-flex align-items-center gap-2">
          <Image
            src="/assets/logo.png"
            alt="ChitChat Logo"
            width={36}
            height={36}
            priority
          />
          <span className="fw-semibold fs-5">ChitChat</span>
        </div>

        {/* Right side dropdown */}
        <div className="ms-auto">
          <div className="dropdown">
            <button
              className="btn btn-light border dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              🌐 Language
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow-sm">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => switchLanguage('en')}
                >
                  🇺🇸 English
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => switchLanguage('hi')}
                >
                  🇮🇳 हिंदी
                </button>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default AuthHeader;