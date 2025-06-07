from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from autentication.retorna_datos import UserInfoView

from .views import ListUsersView, RegisterView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='registerUser'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='tokenRefresh'),
    path('user-info/', UserInfoView.as_view(), name='user-info'),
    path('users/', ListUsersView.as_view(), name='list-users'),

   
]