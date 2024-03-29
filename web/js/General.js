function showResult(generation , gene){
    console.log(generation, gene);
    jQuery("#generationNumber").html(generation);
    jQuery("#standardDeviationNumber").html(Math.floor(Math.sqrt(gene.standardDeviation)));
    jQuery("#estraServicesNumber").html(gene.extraServices);
    jQuery("#extraDurationNumber").html(gene.extraDuration);
    var fittestResult = "";
    jQuery.each(gene.AgentsData, function (i, data){
        fittestResult += "<tr>" +
        "<td> " + agents.agent[i].name + " </td>" + 
        "<td>" + data.duration + " </td>" +
        "<td>" + data.commission + " </td>" +
        "<td> " + TableServices(i, gene) + "</td>" +
        "</tr>";
    })
    
    jQuery("#fittestResult").html(fittestResult);
}

function TableServices(agent, gene){
    var retTable = '<table class="table table-striped table-hover">';
    for (var i = 0; i < gene.dna.length; i++) {
        if (gene.dna[i] == agent) {
            var service = services.service[i].code;
            if (agents.agent[agent].services.id.indexOf(service) >= 0){
                retTable += "<tr><th scope='col'>Id</th><td>" + services.service[i].id + "</td>"
                retTable += "<th scope='col'>Código</th><td>" + services.service[i].code + "</td>"
                retTable += "<th scope='col'>Comisión</th><td>" + tableData[service].commission + "</td>"
                retTable += "<th scope='col'>Horas</th><td>" + tableData[service].duration + "</td>"
                retTable += "<th scope='col'>Cliente</th><td>" + services.service[i].client + "</td></tr>"
            }
        }
    }

    retTable += "</table>"
    return retTable;
}

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

function xmlToJson(xml) {
	var obj = {};
	if (xml.nodeType == 1) {
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) {
		obj = xml.nodeValue;
	}

	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};


(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#sideNav'
  });

})(jQuery); // End of use strict

function xmlToJson(xml) {
    var objeto = {};
    var esRaiz = false;

    if (xml.nodeType == 1) {
        if (xml.attributes.length > 0) {
            for (var j = 0; j < xml.attributes.length; j++) {
                var atributo = xml.attributes.item(j);
                objeto[atributo.nodeName] = atributo.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) {
        objeto = xml.nodeValue;
    } else if (xml.nodeType == 9) {
        esRaiz = true;
    }

    if (xml.hasChildNodes()) {
        for(var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nombreNodo = item.nodeName;

            if (typeof(objeto[nombreNodo]) == "undefined") {
                if (nombreNodo == "#cdata-section") {
                    objeto = item.nodeValue;
                } else if (nombreNodo == "#text") {
                    if (item.childNodes.length < 1) {
                        objeto = item.nodeValue;
                    } else {
                        objeto[nombreNodo] = xmlToJson(item);
                    }
                } else {
                    if (esRaiz) {
                        objeto = xmlToJson(item);
                    } else {
                        objeto[nombreNodo] = xmlToJson(item);
                    }
                }
            } else {
                if (typeof(objeto[nombreNodo].push) == "undefined") {
                    var valorAtributo = objeto[nombreNodo];
                    objeto[nombreNodo] = new Array();
                    objeto[nombreNodo].push(valorAtributo);
                }

                objeto[nombreNodo].push(xmlToJson(item));
            }
        }
    }
    
    return objeto;
};
