from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .autenticacion import is_specialist
from ..models import Paciente
from ..serializers import PacienteSerializer

# Guardar Pacientes
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_patient_data(request):
    if not is_specialist(request.user):
        return JsonResponse({'error': 'No tienes permiso para acceder a esta funcionalidad.'}, status=403)

    serializer = PacienteSerializer(data=request.data)
    if serializer.is_valid():
        paciente = serializer.save(creado_por=request.user)
        return JsonResponse({"message": "Paciente guardado correctamente", "id": paciente.id}, status=201)
    else:
        return JsonResponse(serializer.errors, status=400)

# Listar Pacientes
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def lista_pacientes(request):
    pacientes = Paciente.objects.all()
    serializer = PacienteSerializer(pacientes, many=True)
    return JsonResponse(serializer.data, safe=False)

# Actualizar Paciente
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_paciente(request, pk):
    try:
        paciente = Paciente.objects.get(pk=pk)
    except Paciente.DoesNotExist:
        return JsonResponse({'error': 'Paciente no encontrado.'}, status=404)
    if paciente.creado_por != request.user:
        return JsonResponse({'error': 'No tienes permiso para modificar este paciente.'}, status=403)
    serializer = PacienteSerializer(paciente, data=request.data, partial=(request.method == 'PATCH'))
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data)
    return JsonResponse(serializer.errors, status=400)

# Eliminar Paciente
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_paciente(request, pk):
    try:
        paciente = Paciente.objects.get(pk=pk)
    except Paciente.DoesNotExist:
        return JsonResponse({'error': 'Paciente no encontrado.'}, status=404)
    if paciente.creado_por != request.user:
        return JsonResponse({'error': 'No tienes permiso para eliminar este paciente.'}, status=403)
    paciente.delete()
    return JsonResponse({'message': 'Paciente eliminado correctamente.'}, status=204)

# Gráficas estadísticas
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def stats_resultado(request):
    if not is_specialist(request.user):
        return JsonResponse({'error': 'No tienes permiso para acceder a esta funcionalidad.'}, status=403)

    columnas = [
        "ant_patologicos_fam",
        "ant_pre_peri_postnatales_positivos",
        "alteraciones_anatomicas",
        "consumo_medicamentos",
        "consumo_toxicos",
        "exp_medios_pantallas",
        "trastorno_neurodesarrollo",
        "obesidad",
        "hipertension_arterial",
        "trastornos_aprendizaje",
        "trastornos_comportamiento",
        "cefalea",
        "res_insulina",
        "depresion",
        "higienico_dietetico",
        "cognitivo_conductual",
        "medicamentoso",
        "resultado"
    ]

    pacientes_usuario = Paciente.objects

    data = {}
    for columna in columnas:
        data[columna] = {
            "si": pacientes_usuario.filter(**{f"{columna}": 1}).count(),
            "no": pacientes_usuario.filter(**{f"{columna}": 0}).count()
        }

    data["sexo"] = {
        "masculino": pacientes_usuario.filter(sexo=0).count(),
        "femenino": pacientes_usuario.filter(sexo=1).count(),
    }

    return JsonResponse(data, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def count_pacientes_no_reentrenados(request):
    count = Paciente.objects.filter(incluido_en_reentrenamiento=False).count()
    return JsonResponse({"nuevos_pacientes": count})