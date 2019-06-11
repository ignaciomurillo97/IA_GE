#! /bin/python3
import xml.etree.ElementTree as ET
import random
import sys
from faker import Faker

fake = Faker()
serviceCodeList= ['ICE', 'ICG', 'ILA', 'RCE', 'RCG', 'RLA']

def generate_random_services():
	probability = random.randint(0, 10)
	if probability > 8:
		services = random.sample(serviceCodeList, 5)
	if probability > 4 and probability < 9:
		services = random.sample(serviceCodeList, 4)
	if probability > 1 and probability < 5:
		services = random.sample(serviceCodeList, 3)
	if probability == 1:
		services = random.sample(serviceCodeList, 2)
	if probability == 0:
		services = random.sample(serviceCodeList, 1)
	return services

def generate_agents(count):
    data = ET.Element('agents')
    for i in range(count):
        agent = ET.SubElement(data, 'agent')
        agent_name = ET.SubElement(agent, 'name')
        agent_id = ET.SubElement(agent, 'id')
        agent_services = ET.SubElement(agent, 'services')

        agent_name.text = fake.name()
        agent_id.text = str(i)

        agent_service_list = generate_random_services()
        for service_id in agent_service_list:
            agent_service_id = ET.SubElement(agent_services, 'id')
            agent_service_id.text = service_id
    return ET.tostring(data)

params = sys.argv[1:]
agents_xml = generate_agents(int(params[0]))
f = open(params[1], 'wb')
f.write(agents_xml)
f.close()
