#! /bin/python3
import xml.etree.ElementTree as ET
import random
import sys
from faker import Faker

fake = Faker()
serviceCodeList= ['ICE', 'ICG', 'ILA', 'RCE', 'RCG', 'RLA']

def generate_random_services():
    return [x for x in serviceCodeList if bool(random.getrandbits(1))]

def generate_services(count):
    data = ET.Element('services')
    for i in range(count):
        service = ET.SubElement(data, 'service')
        service_client = ET.SubElement(service, 'client')
        service_id = ET.SubElement(service, 'id')
        service_code = ET.SubElement(service, 'code')

        service_client.text = fake.name()
        service_id.text = str(i)
        service_code.text = serviceCodeList[random.randrange(0, len(serviceCodeList))]

    return ET.tostring(data)

params = sys.argv[1:]
services_xml = generate_services(int(params[0]))
f = open(params[1], 'wb')
f.write(services_xml)
f.close()
