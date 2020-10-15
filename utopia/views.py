from django.shortcuts import render
from django.http import HttpResponse

from . import utopia_grid


# Create your views here.
def home(request):
    return render(request, 'utopia/home.html')


def game(request):
    if request.method == 'POST':
        num_of_rows = 20  # request.POST['row']
        num_of_cols = 20  # request.POST['col']
        game_grid = utopia_grid.initialize(int(num_of_rows), int(num_of_cols))
        game_grid = list(game_grid)
        context = {
            'num_of_rows': num_of_rows,
            'num_of_cols': num_of_cols,
            'game_grid': game_grid
        }
        return render(request, 'utopia/game.html', context)
    return HttpResponse("You got to this page without setting up the game! Go back to the home page to set up the game")
