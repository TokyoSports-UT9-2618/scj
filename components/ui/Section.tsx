import { ReactNode } from 'react';

interface SectionProps {
    children: ReactNode;
    className?: string;
    bgColor?: 'white' | 'subtle' | 'navy'; // 'navy' for dark sections
    id?: string;
}

export default function Section({ children, className = '', bgColor = 'white', id }: SectionProps) {
    const bgClasses = {
        white: 'bg-white',
        subtle: 'bg-slate-50', // Updated to match global variables
        navy: 'bg-navy-900 text-white',
    };

    return (
        <section id={id} className={`py-16 md:py-24 ${bgClasses[bgColor]} ${className}`}>
            <div className="container mx-auto px-4 md:px-6">
                {children}
            </div>
        </section>
    );
}
