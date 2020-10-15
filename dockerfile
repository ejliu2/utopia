# Dockerfile

# Base Image
FROM ubuntu:latest

# Environment Variables
ENV PYTHONUNBUFFERED 1

# Set Work Directory
WORKDIR /code

# Install Dependencies
COPY . /code/
RUN apt-get update \
    && apt-get install -y \
    build-essential \
    python3 \
    python3-pip \
    python3-dev \
    # swig \
    # && cd minesweeper \
    # && pwd \
    # && swig -c++ -python minesweeper_grid.i \
    # && g++ -fPIC -c minesweeper_grid.cpp \
    # && g++ -fPIC -c minesweeper_grid_wrap.cxx -I/usr/include/python3.8 \
    # && g++ -shared minesweeper_grid.o minesweeper_grid_wrap.o -o _minesweeper_grid.so \
    # && ls \
    # && cd .. \
    # && pwd \
    # && cd utopia \
    # && pwd \
    # && swig -c++ -python utopia_grid.i \
    # && g++ -fPIC -c utopia_grid.cpp \
    # && g++ -fPIC -c utopia_grid_wrap.cxx -I/usr/include/python3.8 \
    # && g++ -shared utopia_grid.o utopia_grid_wrap.o -o _utopia_grid.so \
    # && ls \
    # && cd .. \
    # && pwd \
    && pip3 install -r requirements.txt

