"use client";

import { useEffect } from 'react';

const BootstrapProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        // Dynamically import Bootstrap JS only on client side
        require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }, []);

    return <>{children}</>;
};

export default BootstrapProvider;

