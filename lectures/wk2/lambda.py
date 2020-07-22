people = [
    {"name": "harry", "house": "g"},
    {"name": "cho", "house": "r"}
]

people.sort(key = lambda person: person["name"])


print(people)