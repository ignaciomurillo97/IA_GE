let population = Array();
let populationSize = 10;
let MaxDuration = 40;

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

let MutationProbabilty = 0.05;
let ExtraDurationPenalty = 20000;
let ExtraServicesPenalty = 200000;
let MaxGenerations = 2000;
let FitnessGoal = 0;

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

function performClick(elemId) {
    var elem = document.getElementById(elemId);
    if(elem && document.createEvent) {
       var evt = document.createEvent("MouseEvents");
       evt.initMouseEvent("click", true, true, window,0,0,0,0,0,false,false,false,false,0,null);
       elem.dispatchEvent(evt);
    }
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

async function ExecuteAlgoritm(){
    if (typeof  agents === 'undefined' || typeof services === 'undefined') {
        alert('Debe cargar los datos para continuar')
        return
    }

    jQuery('#Algorithm').hide();
    population = generateInitialPopulation();
    console.log('antes');
    ExecuteGeneticAlgorithm()
    console.log('despues');
}

function BestSolution(){
    var Fittest = 0;
    for (let i = 0; i < populationSize; i++) {
        if (population[Fittest].fitness > population[i].fitness){
            Fittest = i;
        }
    }

    return population[Fittest];
}

function GeneticAlgorithmIterator(){
    var generation;
    this.startCalculation = () => {
        generation = 0;
        setTimeout(
            this.IterateGeneticAlgorithm.bind(this),
            0
        );
    }
    
    this.IterateGeneticAlgorithm = () => {
        generation++;
        population = NextGeneration();
        fittest = BestSolution();
        showResult(generation, fittest);
        if (fittest.fitness <= FitnessGoal || generation > MaxGenerations){
            return
        }
        setTimeout(
            this.IterateGeneticAlgorithm.bind(this),
            0
        );
    }
}

function ExecuteGeneticAlgorithm(){
    let GEIterator = new GeneticAlgorithmIterator();
    GEIterator.startCalculation();
}

function NextGeneration(){
    var newPopulation = Array();
    var PreviousBestSolution = BestSolution(); 
    var MaxFitness = PreviousBestSolution.fitness;
    newPopulation.push(PreviousBestSolution);
    for (let i = 1; i < populationSize; i++) {
        var parent1 = SelectParent();
        var parent2 = SelectParent();
        var newGene = CrossParents(parent1, parent2);
        for (let j = 0; j < services.service.length; j++) {
            if (Math.random() < MutationProbabilty){
                newGene.dna[j] = Math.floor(Math.random() * agents.agent.length);
            }
        }
        newGene.fitness = calculateFitness(newGene);
        if (MaxFitness < newGene.fitness){
            MaxFitness = newGene.fitness;
        }
        newPopulation.push(newGene)
    }
    MaxFitnessGeneration = MaxFitness;
    return newPopulation;
}

function SelectParent(){
    var i = 0;
    while(i < MaxGenerations){
        i++;
        var randomParent = population[Math.floor(Math.random() * populationSize)];
        var randomNumber = Math.random() * MaxFitnessGeneration;
        if (randomNumber >= randomNumber.fitness){
            return randomParent;
        }
    }

    return randomParent;
}

function CrossParents(parent1, parent2){
    var geneSize = services.service.length;
    let gene = {};
    gene.dna = Array();
    gene.dna = parent1.dna.slice(0, Math.floor(geneSize/2)).concat(parent2.dna.slice(Math.floor(geneSize/2)));
    return gene;
}

function calculateFitness(gene){
    var FitnessData = {};
    var fitness = 0;
    var average = 0;
    var extraDuration = 0;
    var extraServices = 0;

    for (let i = 0; i < gene.dna.length; i++) {
        var service = services.service[i].code;
        var agent = agents.agent[gene.dna[i]];
        if (agent.services.id.indexOf(service) >= 0){
            

            if (!(gene.dna[i] in FitnessData)){
                FitnessData[gene.dna[i]] = {commission: 0, duration: 0};
            }

            FitnessData[gene.dna[i]].commission += tableData[service].commission;
            average += tableData[service].commission;
            FitnessData[gene.dna[i]].duration += tableData[service].duration;
        }else{
            extraServices++;
        }
    }
    average /= agents.agent.length;

    jQuery.each(FitnessData, function(i, data){
        fitness += Math.pow(data.commission - average, 2)
        if (data.duration > MaxDuration){
            extraDuration += (data.duration - MaxDuration);
        }
    });
    
    fitness /= agents.agent.length;
    gene.standardDeviation = fitness;
    gene.AgentsData = FitnessData;
    gene.extraDuration = extraDuration;
    gene.extraServices = extraServices;
    fitness += extraDuration * ExtraDurationPenalty;
    fitness += extraServices * ExtraServicesPenalty;

    return fitness;
}

function generateInitialPopulation() {
    for (let i = 0; i < populationSize; i++) {
        let gene = {};
        gene.dna = Array();
        for (let j = 0; j < services.service.length; j++){
            gene.dna.push(Math.floor(Math.random() * agents.agent.length));
        }
        gene.fitness = calculateFitness(gene);
        if (i == 0 || MaxFitnessGeneration > gene.fitness){
            MaxFitnessGeneration = gene.fitness;
        }
        population.push(gene);
    }
    return population;
}
