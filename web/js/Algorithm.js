let populationSize = 5;
let tableData = {
    'ICE': {service: 'Instalación de cocina eléctrica', duration: 2, commission: 250},
    'ICG': {service: 'Instalación de cocina de gas', duration: 4, commission: 400},
    'ILA': {service: 'Instalación de lavadora automática', duration: 1, commission: 200},
    'RCE': {service: 'Reparación de cocina eléctrica', duration: 4, commission: 300},
    'RCG': {service: 'Reparación de cocina de gas', duration: 6, commission: 500},
    'RLA': {service: 'Reparación de lavadora automática', duration: 6, commission: 250}
};

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

function ExecuteAlgoritm(){
    if (typeof  agents === 'undefined' || typeof services === 'undefined') {
        alert('Debe cargar los datos para continuar')
        return
    }

    var initialPopulation = generateInitialPopulation();
    console.log(initialPopulation);
}

function calculateFitness(gene){
    var AgentCommission = {};
    var fitness = 0;
    var average = 0;
    for (let i = 0; i < gene.dna.length; i++) {
        var service = services.service[i].code;
        var serviceCommission = tableData[service].commission;

        if (!(gene.dna[i] in AgentCommission)){
            AgentCommission[gene.dna[i]] = 0;
        }
        AgentCommission[gene.dna[i]] += serviceCommission;
        average += serviceCommission;
    }

    average /= agents.agent.length;

    console.log(average)
    console.log(AgentCommission)

    return fitness;
}

function generateInitialPopulation() {
    var population = Array();
    for (let i = 0; i < populationSize; i++) {
        let gene = {};
        gene.dna = Array();
        for (let j = 0; j < services.service.length; j++){
            gene.dna.push(Math.floor(Math.random() * agents.agent.length));
        }
        gene.fitness = calculateFitness(gene);
        population.push(gene);
    }
    return population;
}
