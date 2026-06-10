from django.contrib import admin
from django.urls import path, include
from .views import dashboard, tokenize

urlpatterns = [
    path(''         , dashboard         , name='dashboard'),
    path('tokenize/', tokenize          , name='tokenize'),
    path('admin/'   , admin.site.urls),
]
