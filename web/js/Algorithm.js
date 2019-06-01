let agents;
let services;

function showAgents(){
    console.log('Agents', agents)
}

function showServices(){
    console.log("Services", services)
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