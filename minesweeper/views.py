from django.shortcuts import render
from django.http import HttpResponse

from . import minesweeper_grid

# Create your views here.
def home(request):
    return render(request, 'minesweeper/home.html')


def game(request):
    if request.method == 'POST':
        num_of_rows = request.POST['row']
        num_of_cols = request.POST['col']
        num_of_bombs = request.POST['bombs']
        game_grid = minesweeper_grid.initialize(int(num_of_rows), int(num_of_cols), int(num_of_bombs))
        # game_grid = [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, -1, 1, 0, 1, 1, 1]
        game_grid = list(game_grid)
        context = {
            'num_of_rows': num_of_rows,
            'num_of_cols': num_of_cols,
            'num_of_bombs': num_of_bombs,
            'game_grid': game_grid
        }
        return render(request, 'minesweeper/game.html', context)
    return HttpResponse("You got to this page without setting up the game! Go back to the home page to set up the game")
