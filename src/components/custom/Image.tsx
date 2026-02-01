import Image from "next/image";

interface CustomImageProps extends React.ComponentProps<typeof Image> {
  src: string,
  height?: number,
  width?: number,
}

export default function CustomImage({
    className,
    src,
    width = 50,
    height = 50
  }: CustomImageProps) {
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
