import sys

try:
    x = int(input("x: "))
    y = int(input("y: "))
except ValueError:
    print("bad")
    sys.exit(1)

try:
    result = x / y
except ZeroDivisionError:
    print("cannot divide by zero")
    sys.exit(1)