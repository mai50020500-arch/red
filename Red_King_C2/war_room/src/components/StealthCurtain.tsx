import { useState, useEffect } from 'react';

const StealthCurtain = () => {
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Panic Button: Alt + H
            if (e.altKey && e.key === 'h') {
                setHidden(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!hidden) return null;

    return (
        <div className="fixed inset-0 z-50 bg-blue-600 text-white font-mono flex items-center justify-center cursor-none">
            <div className="max-w-4xl p-10">
                <h1 className="text-9xl mb-10">:(</h1>
                <p className="text-2xl mb-4">Your device ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.</p>
                <p className="text-xl">0% complete</p>
                <br />
                <p className="text-sm">Stop Code: CRITICAL_PROCESS_DIED</p>
            </div>
        </div>
    );
};

export default StealthCurtain;
