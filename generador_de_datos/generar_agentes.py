#! /bin/python3
import xml.etree.ElementTree as ET
import random
from faker import Faker

fake = Faker()
serviceCodeList= ['ICE', 'ICG', 'ILA', 'RCE', 'RCG', 'RLA']

def generate_random_services():
    return [x for x in serviceCodeList if bool(random.getrandbits(1))]

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

print(generate_agents(1000))
