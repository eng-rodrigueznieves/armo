from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes


def serialize_user(user):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "is_staff": user.is_staff,
    }

@api_view(["GET"])
@permission_classes([AllowAny])
def health_check(request):
    return Response(
        {
            "status": "ok",
            "service": "ARMO Visual API",
        }
    )


@ensure_csrf_cookie
@api_view(["GET"])
@permission_classes([AllowAny])
def csrf(request):
    return Response(
        {
            "detail": "CSRF cookie set."
        }
    )


@csrf_protect
@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {
                "detail": "Username and password are required."
            }
        )
    
    user = authenticate(request, username=username, password=password)

    if user is None:
        return Response(
            {
                "detail": "Invalid username or password."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    if not user.is_active:
        return Response(
            {
                "detail": "This employee account is inactive."
            },
            status=status.HTTP_403_FORBIDDEN,
        )
    
    login(request, user)

    return Response(
        {
            "detail": "Login successful.",
            "user": serialize_user(user),
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)

    return Response(
        {
            "detail": "Logout successful."
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(
        {
            "user": serialize_user(request.user)
        }
    )
