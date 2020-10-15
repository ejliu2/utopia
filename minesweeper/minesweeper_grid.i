%module minesweeper_grid
%{
    #include "minesweeper_grid.hpp"
%}
%include "std_vector.i"
namespace std {
    %template(IntVector) vector<int>;
};
%include "minesweeper_grid.hpp"

%inline %{
extern std::vector<int> initialize(int row, int col, int numOfBombs);
%}