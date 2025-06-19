from django.db import models
from django.contrib.auth.models import User


class Paciente(models.Model):
    sexo = models.IntegerField(default=0)
    edad = models.IntegerField()
    ant_patologicos_fam = models.IntegerField(default=0)
    ant_pre_peri_postnatales_positivos = models.IntegerField(default=0)
    alteraciones_anatomicas = models.IntegerField(default=0)
    consumo_medicamentos = models.IntegerField(default=0)
    consumo_toxicos = models.IntegerField(default=0)
    exp_medios_pantallas = models.IntegerField(default=0)
    trastorno_neurodesarrollo = models.IntegerField(default=0)
    obesidad = models.IntegerField(default=0)
    hipertension_arterial = models.IntegerField(default=0)
    trastornos_aprendizaje = models.IntegerField(default=0)
    trastornos_comportamiento = models.IntegerField(default=0)
    cefalea = models.IntegerField(default=0)
    res_insulina = models.IntegerField(default=0)
    depresion = models.IntegerField(default=0)
    higienico_dietetico = models.IntegerField(default=0)
    cognitivo_conductual = models.IntegerField(default=0)
    medicamentoso = models.IntegerField(default=0)
    resultado = models.IntegerField(default=0)
    confianza_prediccion = models.FloatField(null=True, blank=True)  # Nuevo campo
    diagnostico_real = models.IntegerField(null=True, blank=True)  # 1=Positivo, 0=Negativo, null=sin verificar
    incluido_en_reentrenamiento = models.BooleanField(null=True, default=None)
    creado_por = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pacientes')



  
    def __str__(self):
        return (
            f"Paciente {self.id} -, {self.edad} años | "
            f"Sexo: {'Femenino' if self.sexo == 1 else 'Masculino'}, "
            f"APF: {'Sí' if self.ant_patologicos_fam == 1 else 'No'}, "
            f"APP+: {'Sí' if self.ant_pre_peri_postnatales_positivos == 1 else 'No'}, "
            f"Alt. Anat.: {'Sí' if self.alteraciones_anatomicas == 1 else 'No'}, "
            f"Cons. Med.: {'Sí' if self.consumo_medicamentos == 1 else 'No'}, "
            f"Cons. Tóx.: {'Sí' if self.consumo_toxicos == 1 else 'No'}, "
            f"Exp. Pantallas: {'Sí' if self.exp_medios_pantallas == 1 else 'No'}, "
            f"Neurodesarrollo: {'Sí' if self.trastorno_neurodesarrollo == 1 else 'No'}, "
            f"Obesidad: {'Sí' if self.obesidad == 1 else 'No'}, "
            f"Hipertensión: {'Sí' if self.hipertension_arterial == 1 else 'No'}, "
            f"Aprendizaje: {'Sí' if self.trastornos_aprendizaje == 1 else 'No'}, "
            f"Comportamiento: {'Sí' if self.trastornos_comportamiento == 1 else 'No'}, "
            f"Cefalea: {'Sí' if self.cefalea == 1 else 'No'}, "
            f"Insulina: {'Sí' if self.res_insulina == 1 else 'No'}, "
            f"Depresión: {'Sí' if self.depresion == 1 else 'No'}, "
            f"Hig.-Diet.: {'Sí' if self.higienico_dietetico == 1 else 'No'}, "
            f"Cogn.-Cond.: {'Sí' if self.cognitivo_conductual == 1 else 'No'}, "
            f"Medicamentoso: {'Sí' if self.medicamentoso == 1 else 'No'}, "
            f"Resultado: {'Positivo' if self.medicamentoso == 1 else 'Negativo'}, "
    )

class ReentrenamientoLog(models.Model):
    usuario = models.CharField(max_length=150)  # Solo el nombre de usuario
    total_pacientes = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    accuracy = models.FloatField()
    classification_report_test = models.TextField()
    confusion_matrix_test = models.JSONField()
    importancia_caracteristicas = models.JSONField(null=True, blank=True)  # Nuevo campo

    def __str__(self):
        return f"Reentrenamiento por {self.usuario} en {self.timestamp}"
