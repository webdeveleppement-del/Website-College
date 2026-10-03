from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from django.urls import path

from .views import (
    login,
    me,
    register,
)


urlpatterns = [

    path(
        "login/",
        login,
        name="login",
    ),

    path(
        "register/",
        register,
        name="register",
    ),

    path(
        "me/",
        me,
        name="me",
    ),

    path(
        "token/",
        TokenObtainPairView.as_view(),
        name="token",
    ),

    path(
        "token/refresh/",
        TokenRefreshView.as_view(),
        name="token-refresh",
    ),
]
