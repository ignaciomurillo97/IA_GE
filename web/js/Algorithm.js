let agents;
let services;

function showAgents(){
    jQuery.each(agents.agent, function (i, agent){
        var htmlAgent = "<tr>"+
        "<td>" + agent.id +"</td>" +
        "<td>" + agent.name +"</td>" +
        "<td>";
        htmlAgent += agent.services.id;
        htmlAgent += "</td>" +
        "</tr>";
        jQuery("#AgentsTarget").append(htmlAgent);
    });
}

function showServices(){
    console.log(services)
    jQuery.each(services.service, function (i, service){
        var htmlAgent = "<tr>"+
        "<td>" + service.id +"</td>" +
        "<td>" + service.code +"</td>" +
        "<td>" + service.client + "</td>" +
        "</tr>";
        jQuery("#ServicesTarget").append(htmlAgent);
    });
}

window.onload = function() {
    jQuery("#uploadAgents").change(function (e){
        if (e.target.files.length <= 0) return false;

        readUploadedFileAsText(e.target.files[0]).then((value) =>{
            agents = value;
            showAgents();
        });
    });

    jQuery("#uploadServices").change(function (e){
        if (e.target.files.length <= 0) return false;
        
        readUploadedFileAsText(e.target.files[0]).then((value) =>{
            services = value;
            showServices();
        });
    });

};

function generateInitialPopulation(agents, services, populationSize) {
    var population = Array();
    for (let i = 0; i < populationSize; i++) {
        let gene = {};
        gene.dna = Array();
        gene.fitness = 0;
        for (let j = 0; j < services.length; j++){
            gene.dna.push(Math.floor(Math.random() * agents.length));
        }
        population.push(gene);
    }
    return population;
}
