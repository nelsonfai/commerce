import clsx from 'clsx';

export default function LogoIconMobile(props: React.ComponentProps<'img'>) {
  // Create absolute URL for the logo
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const logoSrc = `${baseUrl}/logo-m.png`;

  return (
    <img
      src={logoSrc}
      alt={`${process.env.NEXT_PUBLIC_SITE_NAME || 'mobile icon'} logo`}
      {...props}
      className={clsx(props.className)}
    />
  );
}