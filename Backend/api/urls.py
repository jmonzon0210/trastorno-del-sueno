from django.urls import path
from api.views.autenticacion import login, logout, get_user, refresh_token
from api.views.ia import predecir_trastorno, reentrenar_modelo, obtener_logs_reentrenamiento, metricas_modelo_actual
from api.views.pacientes import (
    lista_pacientes, save_patient_data, update_paciente, delete_paciente,
    stats_resultado, count_pacientes_no_reentrenados
)
from api.views.usuarios import lista_usuarios, crear_usuario, editar_usuario, eliminar_usuario, cambiar_contrasena

urlpatterns = [
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('token/refresh/', refresh_token, name='token_refresh'),
    path('user/', get_user, name='get_user'),

    path('save_patient/', save_patient_data, name='save_patient'),
    path('pacientes/', lista_pacientes, name='lista_pacientes'),
    path('pacientes/<int:pk>/actualizar/', update_paciente, name='update_paciente'),
    path('pacientes/<int:pk>/eliminar/', delete_paciente, name='delete_paciente'),
    path('predecir/', predecir_trastorno, name='predecir'),
    path('estadisticas/', stats_resultado, name='Resultados'),
    
    path('pacientes_no_reentrenados/', count_pacientes_no_reentrenados),
    path('reentrenar_modelo/', reentrenar_modelo, name='Reentrenar Modelo'),
    path('retrain_logs/', obtener_logs_reentrenamiento),

    path('usuarios/', lista_usuarios, name='lista_usuarios'),
    path('usuarios/crear/', crear_usuario, name='crear_usuario'),
    path('usuarios/<int:id>/editar/', editar_usuario, name='editar_usuario'),
    path('usuarios/<int:id>/eliminar/', eliminar_usuario, name='eliminar_usuario'),
    path('usuarios/<int:id>/cambiar-contrasena/', cambiar_contrasena, name='cambiar_contrasena'),
    path('metricas_modelo_actual/', metricas_modelo_actual, name='metricas_modelo_actual'),
]
