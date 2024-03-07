import React from 'react';

function TextBlock({ text, key }:any) {
    console.log("tttttt",text)
  return (
    <div className="row">
      <div className="col-sm-12 portable-text justify-content-center">
        {text}
      </div>
    </div>
  );
}

export default TextBlock;
