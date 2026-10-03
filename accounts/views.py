from rest_framework import status
from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    LoginSerializer,
    ProfileUpdateSerializer,
    RegisterSerializer,
    UserSerializer,
)


def generate_tokens(user):

    refresh = RefreshToken.for_user(
        user
    )

    return {
        "refresh": str(refresh),
        "access": str(
            refresh.access_token
        ),
    }


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):

    serializer = RegisterSerializer(
        data=request.data
    )

    serializer.is_valid(
        raise_exception=True
    )

    user = serializer.save()

    tokens = generate_tokens(
        user
    )

    return Response(
        {
            "success": True,
            "message": "Compte créé avec succès.",
            "user": UserSerializer(
                user
            ).data,
            "tokens": tokens,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):

    serializer = LoginSerializer(
        data=request.data
    )

    serializer.is_valid(
        raise_exception=True
    )

    user = serializer.validated_data[
        "user"
    ]

    tokens = generate_tokens(
        user
    )

    return Response(
        {
            "success": True,
            "message": "Connexion réussie.",
            "user": UserSerializer(
                user
            ).data,
            "tokens": tokens,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def me(request):

    if request.method == "PATCH":
        serializer = ProfileUpdateSerializer(
            request.user,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

    return Response(
        {
            "success": True,
            "user": UserSerializer(
                request.user
            ).data,
        }
    )
