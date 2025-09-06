import clsx from "clsx";

type SpinLoaderProps = {
  className?: string;
};

export default function SpinLoader({ className = '' }: SpinLoaderProps) {
  const classes = clsx('flex', 'items-center', 'justify-center', className);

  return (
    <div className={classes}>
      
    </div>
  );
}