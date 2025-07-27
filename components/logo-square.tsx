import clsx from 'clsx';
import LogoIcon from './icons/logo';
import LogoIconMobile from './icons/logo_mobile';

export default function LogoSquare({ size }: { size?: 'sm' }) {
  return (
    <>
      {/* Desktop Logo */}
      <LogoIcon
        className={clsx(
          'hidden sm:block', // hidden on mobile, shown on sm+
          size === 'sm' ? 'w-[90px]' : 'w-[154px]'
        )}
      />

      {/* Mobile Logo */}
      <LogoIconMobile
        className={clsx(
          'block sm:hidden', // visible on mobile only
          size === 'sm' ? 'w-[90px]' : 'w-[154px]'
        )}
      />
    </>
  );
}
