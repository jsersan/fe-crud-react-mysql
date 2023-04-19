import React, {useEffect, useState} from "react";
import Modal from 'react-modal';

function App() {

  const [file, setFile] = useState(null);
  const [imageList,setImageList] = useState([]);
  const [listUpdated, setlistUpdated] = useState(false);

  const [currentImage, setcurrentImage] = useState(null);

  const [modalIsOpen, setmodalIsOpen] = useState(false);

  useEffect(() => {

    Modal.setAppElement('body');
    fetch('http://localhost:9000/images/get')
      // La respuesta la vamos a formatear en texto
      .then(res=> res.json())
      .then(res=>setImageList(res)) // Imprimimos la respuesta
      .catch(err => {             // Si hay algún error lo imprimimos
        console.log(err)
        })
      setlistUpdated(false);  
  }, [listUpdated]);

  const selectedHandler = e => {
    setFile(e.target.files[0]);
  }

  const sendHandler = () =>{

    // Comprobamos si se ha seleccionado un archivo

    if(!file){
      alert('Debes elegir un archivo');
      return;
    }

    const formdata = new FormData();

    // Vamos a agregar el archivo que está en el state
    formdata.append('image', file);

    // Vamos a hacer una pètición asíncrona en el servidor
    fetch('http://localhost:9000/images/post',{
      method: 'POST',
      body: formdata
    })
      // La respuesta la vamos a formatear en texto
      .then(res=> res.text())
      .then(res=>{
        console.log(res) // Imprimimos la respuesta
        setlistUpdated(true); // Indicamos que las imágenes han sido actualizadas
       }) 
      .catch(err => {             // Si hay algún error lo imprimimos
        console.error(err)
        })

     document.getElementById("fileinput").value = null;   
     setFile(null);   
  }

  const modalHandler = (isOpen,image) => {
    setmodalIsOpen(isOpen);
    setcurrentImage(image);
  }

  const deleteHandler = () =>{

    let imageId = currentImage.split("-");

    imageId = parseInt(imageId[0]);
    
    fetch(`http://localhost:9000/images/delete/${imageId}`,{
      method: 'DELETE'
    })
    .then(res=>res.text())
    .then(res=>console.log(res))

    // Una vez eliminado actualizamos el panel y cerramos el modal

    setmodalIsOpen(false);
    setlistUpdated(true);

  }
   

  return (
  <>
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <a href="#!" className="navbar-brand">Image App</a>
      </div>
    </nav>
    <div className="container mt-5">
      <div className="card p-3">
        <div className="row">
          <div className="col-10">
            <input id="fileinput"
                   onChange={selectedHandler} className="form-control" type="file"/>
          </div>
          <div className="col-2">
            <button onClick={sendHandler}
                    type="button" 
                    className="btn btn-primary col-12">Upload</button>
          </div>
        </div>
      </div>
    </div>

     <div className="container mt-3" style={{display: "flex",flexWrap: "wrap"}}>
        {imageList.map(image =>(
            <div key = {image} className="card m-2">
                <img src={'http://localhost:9000/'+image} alt="" className="card-img-top" 
                     style={{height:"200px",width:"300px"}}/>
                <div className="card-body">
                  <button onClick={()=>modalHandler(true,image)}
                  className="btn btn-dark">
                    Ver Imagen
                  </button>
                </div>
            </div>
        ))}
    </div> 

    <Modal style={{content: {right: "20%", left:"20%"}}} 
           isOpen={modalIsOpen} 
           onRequestClose={()=>modalHandler(false,null)}
    >
      <div className="card">
          <img src={'http://localhost:9000/'+ currentImage} alt="..." />
          <div className="card-body">
                  <button onClick={()=>deleteHandler()}
                          className="btn btn-danger">Delete</button>
            </div>
      </div>
    </Modal>


  </>
  );
}

export default App;
