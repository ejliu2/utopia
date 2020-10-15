#!/usr/bin/env python

"""
setup.py file for utopia
"""

from distutils.core import setup, Extension

utopia_grid_module = Extension('_utopia_grid', sources=['utopia_grid_wrap.cxx', 'utopia_grid.cpp'])

setup(name = 'utopia_grid', version  = '0.1', author = "Eric Liu", description = """utopia_grid""", ext_modules=[utopia_grid_module], py_modules=["utopia_grid"],)