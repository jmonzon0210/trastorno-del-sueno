from rest_framework.decorators import api_view, permission_classes
from .autenticacion import is_admin
from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import Group

#Obtener la lista de usuarios con sus respectivos roles
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def lista_usuarios(request):
    if not is_admin(request.user):
        return JsonResponse({'error': 'No tienes permiso para ver usuarios.'}, status=403)

    usuarios = User.objects.filter(is_superuser=False).prefetch_related('groups')

    lista_usuarios = [
        {
            "id": usuario.id,
            "username": usuario.username,
            "email": usuario.email,
            "is_active": usuario.is_active,
            "role": ", ".join([group.name for group in usuario.groups.all()]),  # ✅ Obtener los roles
            "date_joined": usuario.date_joined,  # <-- Agrega esto

        }
        for usuario in usuarios
    ]

    return JsonResponse(lista_usuarios, safe=False)

#Crear usuarios
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_usuario(request):
    if not is_admin(request.user):
        return JsonResponse({'error': 'No tienes permiso para crear usuarios.'}, status=403)

    data = request.data
    username = data.get("username")
    email = data.get("email", "")
    password = data.get("password", "123456")
    role = data.get("role", "Especialista")  # Por defecto Especialista

    #Veriificar si el nombre de usuario existe
    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "El nombre de usuario ya está en uso"}, status=400)

    # Crear usuario
    user = User.objects.create_user(username=username, email=email, password=password)

    # Asignar grupo
    group, _ = Group.objects.get_or_create(name=role)
    user.groups.add(group)

    return JsonResponse({"message": "Usuario creado con éxito"})

#Editar usuarios
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def editar_usuario(request, id):
    if not is_admin(request.user):
        return JsonResponse({'error': 'No tienes permiso para editar usuarios.'}, status=403)

    user = User.objects.get(id=id)
    data = request.data
    new_username = data.get("username", user.username)

    # Verificar si el nuevo username ya existe en otro usuario
    if User.objects.filter(username=new_username).exclude(id=user.id).exists():
        return JsonResponse({"error": "El nombre de usuario ya está en uso."}, status=400)

    user.username = new_username
    user.email = data.get("email", user.email)

    if "password" in data:
        user.set_password(data.get("password"))

    # Actualizar grupo
    if "role" in data:
        user.groups.clear()  # Elimina los grupos actuales
        group, _ = Group.objects.get_or_create(name=data["role"])
        user.groups.add(group)

    user.save()
    return JsonResponse({"message": "Usuario actualizado con éxito"})

#Eliminar Usuarios
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def eliminar_usuario(request, id):
    if not is_admin(request.user):
        return JsonResponse({'error': 'No tienes permiso para eliminar usuarios.'}, status=403)

    user = User.objects.get(id=id)
    user.delete()
    return JsonResponse({"message": "Usuario eliminado con éxito"})

#Cambiar contraseña
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cambiar_contrasena(request, id):
    if not is_admin(request.user):
        return JsonResponse({'error': 'No tienes permiso para cambiar contraseñas.'}, status=403)

    user = User.objects.get(id=id)
    data = request.data
    new_password = data.get("password")

    if new_password:
        user.set_password(new_password)
        user.save()
        return JsonResponse({"message": "Contraseña cambiada con éxito"})
    return JsonResponse({"error": "No se proporcionó una contraseña"}, status=400)