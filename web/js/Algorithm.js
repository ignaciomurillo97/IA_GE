const readUploadedFileAsText = (inputFile) => {
    const temporaryFileReader = new FileReader();
  
    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException("Problem parsing input file."));
      };
  
      temporaryFileReader.onload = () => {
        var parser = new DOMParser();
        var xml = parser.parseFromString(temporaryFileReader.result,"text/xml");
        resolve(xmlToJson(xml));
      };
      temporaryFileReader.readAsText(inputFile);
    });
  };


let agents;
let services;

function showAgents(){
    
}

function showServices(){
}

window.onload = function() {
    jQuery("#uploadAgents").change(function (e){
        if (e.target.files.length <= 0) return false;
        const file = e.target.files[0];
        readUploadedFileAsText(file).then((value) =>{
            agents = value.agents;
            showAgents();
        });
    });

    jQuery("#uploadServices").change(function (e){
        if (e.target.files.length <= 0) return false;
        const file = e.target.files[0];
        readUploadedFileAsText(file).then((value) =>{
            console.log(value);
            services = value.services;
            showServices();
        });
    });

};