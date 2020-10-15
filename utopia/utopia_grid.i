%module utopia_grid
%{
    #include "utopia_grid.hpp"
%}
%include "std_vector.i"
namespace std {
    %template(IntVector) vector<int>;
};
%include "utopia_grid.hpp"

%inline %{
extern std::vector<int> initialize(int row, int col);
%}