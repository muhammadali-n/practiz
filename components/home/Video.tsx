import React from 'react';

function ProductVideo({ videoUrl, key }: any) {
  console.log("oooo", videoUrl);

  return (
    <div className="col-sm-12 d-flex justify-content-center align-items-center mt-6" style={{marginTop: "2em"}}>
    <video width="740" height="360" controls src={videoUrl}>
      Your browser does not support the video tag.
    </video>
  </div>
  
  
  );
}

export default ProductVideo;
