import clsx from 'clsx';
import LogoIcon from './icons/logo';

export default function LogoSquare({ size }: { size?: 'sm' }) {
  return (
    <LogoIcon
      className={clsx(
        ' w-[154px]', 
        size === 'sm' && ' w-[90px]' 
      )}
    />
  );
}
