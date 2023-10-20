import React from "react";
import { createRoot } from 'react-dom/client';
import { App } from '@containers/home/app';

const container = document.getElementById('root');
console.log('container--', container);
const root = createRoot(container as Element); // createRoot(container!) if you use TypeScript
root.render(<App />);