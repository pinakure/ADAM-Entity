from django.contrib import admin
from django.urls import path, include
from .views import dashboard, tokenize, pronounce, think, imagine

urlpatterns = [
    path(''                 , dashboard         , name='dashboard'  ),
    path('pronounce/'       , pronounce         , name='pronounce'  ),
    path('think/'           , think             , name='think'      ),
    path('imagine/'         , imagine           , name='imagine'    ),
    path('tokenize/'        , tokenize          , name='tokenize'   ),
    path('admin/'           , admin.site.urls),
]
