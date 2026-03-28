import React, { useState, useEffect } from 'react';

interface TypewriterEffectProps {
    text: string;
    speed?: number; // ms per char
    onComplete?: () => void;
    className?: string;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({ 
    text, 
    speed = 20, 
    onComplete,
    className = "" 
}) => {
    const [displayedText, setDisplayedText] = useState("");
    
    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayedText((prev) => prev + text.charAt(index));
                index++;
            } else {
                clearInterval(interval);
                if (onComplete) onComplete();
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed, onComplete]);

    return (
        <div className={`whitespace-pre-wrap ${className}`}>
            <span className="text-cyan-400">{">"} </span>
            {displayedText}
            <span className="animate-pulse">_</span>
        </div>
    );
};

export default TypewriterEffect;
