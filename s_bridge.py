# I apologize for my non-pythonic approach to module formation. This is due to 20 years (before Python) of
# programming experience on VB.net , VBA, JavaScript, in which I can freely call functions from any modules in any
# sequence. This module makes the same possible in Python.

_funcf = []
_funct = []


def from_modules(func):
    _funcf.append(func)
    return func


def out_fnc(obj):
    for f in _funcf:
        f(obj)


def register_writer(func):
    _funct.append(func)
    return func


def write(obj):
    for f in _funct:
        f(obj)