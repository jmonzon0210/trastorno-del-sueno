from django.contrib.auth.models import Group
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


#Función para verificar si el usuario es especialista
def is_specialist(user):
    return user.groups.filter(name="Especialista").exists()

#Función para verificar si el usuario es administrador
def is_admin(user):
    return user.groups.filter(name="Administrador").exists()

#Función para establecer cookies con HttpOnly
def set_cookie(response, key, value, max_age):
    response.set_cookie(
        key,
        value,
        max_age=max_age,
        httponly=True,
        secure=True,
        samesite="None"
    )

#Vista para el login
@api_view(['POST'])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(request, username=username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response = JsonResponse({
            "message": "Login exitoso",
            "username": user.username,
            "role": "Administrador" if is_admin(user) else "Especialista",
            "id": user.id
        })

        # Establecer cookies seguras
        set_cookie(response, "access_token", access_token, 60 * 30)
        set_cookie(response, "refresh_token", refresh_token, 60 * 60 * 24)

        return response
    else:
        return JsonResponse({"error": "Credenciales inválidas"}, status=401)
    
#Vista para el logout
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        # Obtener el refresh token de las cookies
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response({"error": "No se encontró refresh token"}, status=400)

        # Invalidar el refresh token
        token = RefreshToken(refresh_token)
        token.blacklist()

        # Crear respuesta y eliminar cookies
        response = Response({"message": "Logout exitoso"})
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        response["Cache-Control"] = "no-store"  # Evitar caché en el navegador
        return response
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    
#Vista para refrescar el token
@api_view(['GET'])
def refresh_token(request):
    refresh_token = request.COOKIES.get('refresh_token')

    if not refresh_token:
        return JsonResponse({'error': 'No refresh token found'}, status=401)

    try:
        refresh = RefreshToken(refresh_token)
        access_token = str(refresh.access_token)

        response = JsonResponse({'message': 'Token refreshed'})
        set_cookie(response, "access_token", access_token, 60 * 30)

        return response
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=401)
    
#Vista para obtener el usuario actual
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    user = request.user
    role = "Administrador" if is_admin(user) else "Especialista"
    return Response({
        "username": user.username,
        "role": role,
        "id": user.id
    })