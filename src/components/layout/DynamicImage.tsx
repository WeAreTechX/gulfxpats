import Image from "next/image";

interface DynamicImageProps extends React.ComponentProps<typeof Image> {
  src: string,
  height: number,
  width: number,
}

export default function DynamicImage({
    className,
    src,
    width,
    height
  }: DynamicImageProps) {
  const isAbsoluteUrl = src?.includes('http');

  return (
    <Image
      src={src}
      alt="Cause image"
      width="100"
      height="100"
      className={className}
      style={{height: `${height}px`, width: `${width}px`}}
      unoptimized={isAbsoluteUrl}
      {...(isAbsoluteUrl && {
        loader: undefined,
        unoptimized: true
      })}
    />
  );
}
