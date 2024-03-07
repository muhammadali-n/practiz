import React from 'react'

function ProductImage({imageUrl ,key}:any) {
    console.log("oooo",imageUrl)

  return (
    <div>
            {/* <img src={imageUrl} alt="hero" key ={key}/> */}
            <div className="image-container mb-3">
                  <div className="row">
                      <div className="col-sm-4" key={key}>
                        <br />
                        <img
                          key={key}
                          src={imageUrl}
                          alt="hero"
                          className="img-fluid"
                          style={{ maxWidth: '300%', height: '100%' }}
                        />
                        
                      </div>
                  </div>
                </div>
        </div>
  )
}

export default ProductImage;