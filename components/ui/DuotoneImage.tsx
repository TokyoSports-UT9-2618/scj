import Image, { ImageProps } from 'next/image';

interface DuotoneImageProps extends Omit<ImageProps, 'className'> {
    containerClassName?: string;
    overlayColor?: string; // Optional overlay color
}

export default function DuotoneImage({ containerClassName = '', overlayColor, ...props }: DuotoneImageProps) {
    return (
        <div className={`relative overflow-hidden ${containerClassName}`}>
            {/* Base Image with Duotone Filter */}
            <Image
                {...props}
                className="object-cover w-full h-full transition-transform duration-700 hover:scale-105 filter-duotone"
                alt={props.alt || 'Image'}
            />

            {/* Optional Overlay for Text Readability */}
            <div className="absolute inset-0 bg-navy-900/20 mix-blend-multiply pointer-events-none" />
        </div>
    );
}
