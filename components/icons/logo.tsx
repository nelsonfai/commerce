import clsx from 'clsx';

export default function LogoIcon(props: React.ComponentProps<'img'>) {
  return (
    <img
      src="/safari_log.svg"
      alt={`${process.env.NEXT_PUBLIC_SITE_NAME || 'Site'} logo`}
      {...props}
      className={clsx( props.className)}
    />
  );
}
