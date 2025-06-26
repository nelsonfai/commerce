import clsx from 'clsx';

export default function LogoIcon(props: React.ComponentProps<'img'>) {
  // Create absolute URL for the logo
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const logoSrc = `${baseUrl}/safari_log.svg`;

  return (
    <img
      src={logoSrc}
      alt={`${process.env.NEXT_PUBLIC_SITE_NAME || 'Site'} logo`}
      {...props}
      className={clsx(props.className)}
    />
  );
}