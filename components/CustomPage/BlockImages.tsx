import React from 'react'

function BlockImages({imageUrl ,key}:any) {
  return (
    <div>
            {/* Your HeroImage component content */}
            <img src={imageUrl} alt="hero" key ={key}/>
        </div>
  )
}

export default BlockImages