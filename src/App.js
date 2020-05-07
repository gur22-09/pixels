import React from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import './App.css';

class App extends React.Component{
  state={
    src:null,
    crop:{
      unit:'%',
      width:50,
      aspect:16/9
    },
    brightness:'100%'
    
    
  }

 onSelect = (e) =>{
   if(e.target.files && e.target.files.length >0){
     const reader = new FileReader();
     
     console.log(reader);
     reader.addEventListener('load',()=>{
       this.setState({src:reader.result});
     });

     reader.readAsDataURL(e.target.files[0]);
   }
 }

  onImageLoaded = (image)=>{
    this.imageRef = image;
  };

  onCropComplete = (crop)=>{
    this.makeCrop(crop);
  };

  onCropChange = (crop,percentCrop)=>{
    this.setState({crop});
  };


  makeCrop = async (crop)=>{
    if(this.imageRef && crop.width && crop.height){
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        'newFile.jpg'
      );
      this.setState({croppedImageUrl});
    }
  }

  getCroppedImg=(image,crop,fileName)=>{
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth/image.width;
    const scaleY = image.naturalHeight/image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve,reject)=>{
      canvas.toBlob(blob=>{
        if(!blob){
          console.log('Canvas is empty');
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      },'image/jpeg');
    });

  }
  
  changeBrightness = (e)=>{
   const {value} = e.target;

   this.setState({brightness:value});
  };



  render(){

    const {crop,croppedImageUrl,src,brightness} = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1>Pixels</h1>
        
        <div>
          <input type='file' accept='image/*' name='imageFile' onChange={this.onSelect}/>
        </div>
        {
          src && (
            <ReactCrop 
               src={src}
               crop={crop}
               onImageLoaded={this.onImageLoaded}
               ruleOfThirds={true}
               onComplete={this.onCropComplete}
               onChange={this.onCropChange}
            />
          )}

        {
          croppedImageUrl && (
            <div className='container'>
            <img alt='cropped' style={{maxWidth:'100%',
              filter:`${brightness?(`brightness(${brightness})`):(`brightness(100%)`)}`}}
               
             src={croppedImageUrl} 
             className='crop'/> 
             
            <input  type='text' name='brightness' onChange={this.changeBrightness} placeholder='brightness%'/> 
            
            
            </div>
            
            
            
          )
        }
        <h2>brightness :</h2>
        </header>
      </div>
    );
  }

}

export default App;
