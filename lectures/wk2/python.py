class point():
    def __init__(self, x, y):
        self.x = x
        self.y = y

p = point(2, 8)
print(p.x)
print(p.y)


class Flight():
    def __init__(self, capacity):
        self.capacity = capacity
        self.passengers = []
    def add(self, passenger):
        if not self.open_seats():
            return False
        self.passengers.append(passenger)
        return True
    def open_seats(self):
        return self.capacity - len(self.passengers)


flight = Flight(3)