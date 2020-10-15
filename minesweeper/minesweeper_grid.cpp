#include "minesweeper_grid.hpp"

std::vector<int> initialize(int numOfRows, int numOfCols, int numOfBombs) {
    std::vector<int> grid(numOfRows * numOfCols, 0);
    std::random_device random;
    std::mt19937 gen(random());
    std::uniform_int_distribution<> distrib(1, 100);
    int count = 0;

    // Continue to place bombs until number of bombs is met
    while (count < numOfBombs) {
        for (auto& block : grid) {
            if (distrib(gen) == 100 && block != -1) {
                block = -1;
                count++;
            }
            if (count == numOfBombs) break; // breaks out when all bombs have been placed
        }
    }
    for (int i = 0; i < grid.size(); i++) {
        int row = i / numOfRows;
        int col = i % numOfCols;
        // int northwest = (row - 1) * numOfRows + (col - 1);
        // int north = (row - 1) * numOfRows + col;
        // int northeast = (row - 1) * numOfRows + (col + 1);
        // int west = row * numOfRows + (col - 1);
        // int east = row * numOfRows + (col + 1);
        // int southwest = (row + 1) * numOfRows + (col - 1);
        // int south = (row + 1) * numOfRows + col;
        // int southeast = (row + 1) * numOfRows + (col + 1);
        int northwest = i - numOfRows - 1;
        bool nw = (row - 1) == (northwest / numOfRows) && (col - 1) == (northwest % numOfCols);
        int north = i - numOfRows;
        bool n = (row - 1) == (north / numOfRows) && (col) == (north % numOfCols);
        int northeast = i - numOfRows + 1;
        int ne = (row - 1) == (northeast / numOfRows) && (col + 1) == (northeast % numOfCols);
        int west = i - 1;
        bool w = (row) == (west / numOfRows) && (col - 1) == (west % numOfCols);
        int east = i + 1;
        bool e = (row) == (east / numOfRows) && (col + 1) == (east % numOfCols);
        int southwest = i + numOfRows - 1;
        bool sw = (row + 1) == (southwest / numOfRows) && (col - 1) == (southwest % numOfCols);
        int south = i + numOfRows;
        bool s = (row + 1) == (south / numOfRows) && (col) == (south % numOfCols);
        int southeast = i + numOfRows + 1;
        bool se = (row + 1) == (southeast / numOfRows) && (col + 1) == (southeast % numOfCols);
        if (grid[i] != -1) {
            if (nw && northwest >= 0 && northwest < grid.size() && grid[northwest] == -1) {
                grid[i] += 1;
            }
            if (n && north >= 0 && north < grid.size() && grid[north] == -1) {
                grid[i] += 1;
            }
            if (ne && northeast >= 0 && northeast < grid.size() && grid[northeast] == -1) {
                grid[i] += 1;
            }
            if (w && west >= 0 && west < grid.size() && grid[west] == -1) {
                grid[i] += 1;
            }
            if (e && east >= 0 && east< grid.size() && grid[east] == -1) {
                grid[i] += 1;
            }
            if (sw && southwest >= 0 && southwest < grid.size() && grid[southwest] == -1) {
                grid[i] += 1;
            }
            if (s && south >= 0 && south < grid.size() && grid[south] == -1) {
                grid[i] += 1;
            }
            if (se && southeast >= 0 && southeast < grid.size() && grid[southeast] == -1) {
                grid[i] += 1;
            }
        }
    }
    return grid;
}