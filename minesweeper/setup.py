#!/usr/bin/env python

"""
setup.py file for minesweeper
"""

from distutils.core import setup, Extension

minesweeper_grid_module = Extension('_minesweeper_grid', sources=['minesweeper_grid_wrap.cxx', 'minesweeper_grid.cpp'])

setup(name = 'minesweeper_grid', version  = '0.1', author = "Eric Liu", description = """minesweeper_grid""", ext_modules=[minesweeper_grid_module], py_modules=["minesweeper_grid"])