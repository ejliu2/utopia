from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='minesweeper-home'),
    path('game/', views.game, name='minesweeper-game'),
]
