import React from 'react';

const HeroImage = ({ imageUrl }:any) => {
    return (
        <div>
            {/* Your HeroImage component content */}
            <img src={imageUrl} alt="hero" />
        </div>
    );
};

export default HeroImage;