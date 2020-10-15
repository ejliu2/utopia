from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='utopia-home'),
    path('game/', views.game, name='utopia-game'),
]
