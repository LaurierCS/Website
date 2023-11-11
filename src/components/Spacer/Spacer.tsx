import React from 'react';

interface SpacerProps {
     height: string | number;
 }

const Spacer: React.FC<SpacerProps> = ({ height }) => (
     <div style={{ height: height, width: "100%" }} />
);

export default Spacer;