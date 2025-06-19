from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.conf import settings
from api.models import Paciente, ReentrenamientoLog
from .autenticacion import is_specialist, is_admin
import json
from joblib import load
import numpy as np
from scipy.io import arff
import os
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTEN
from collections import Counter

modelo = load('ModeloIA/rf_model.pkl')
scaler = load('ModeloIA/scaler_edad.pkl')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def predecir_trastorno(request):
    if not is_specialist(request.user):
        return JsonResponse({'error': 'No autorizado'}, status=403)

    try:
        # Cargar modelo y scaler en cada predicción
        modelo = load('ModeloIA/rf_model.pkl')
        scaler = load('ModeloIA/scaler_edad.pkl')

        datos = request.data
        variables = datos['variables']
        import numpy as np
        entrada = np.array(variables, dtype=float).reshape(1, -1)  # <-- Asegura float

        # Escalar la edad (suponiendo que está en la columna 1)
        entrada[0, 1] = scaler.transform([[entrada[0, 1]]])[0, 0]
        print(entrada)
        print(f"Edad escalada: {entrada[0,1]:.6f}")
        prediccion = modelo.predict(entrada)
        prob = modelo.predict_proba(entrada)
        print(prob)

        return JsonResponse({
            'prediccion': int(prediccion[0]),
            'probabilidad': prob.max(),
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


    
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reentrenar_modelo(request):
    if not is_admin(request.user):
        return JsonResponse({'error': 'No tienes permiso para acceder a esta funcionalidad.'}, status=403)

    try:
        # 1. Cargar pacientes del ARFF a DataFrame
        ruta_arff = os.path.join('ModeloIA', 'sueno - copia.arff')
        data_arff, _ = arff.loadarff(ruta_arff)
        df_arff = pd.DataFrame(data_arff)
        for col in df_arff.select_dtypes([object]):
            df_arff[col] = df_arff[col].str.decode('utf-8')
        df_arff = df_arff.rename(columns={
            'id': 'id_arff',
            'antecedentes-patologicos-familiares': 'ant_patologicos_fam',
            'antecedentes-pre-peri-postnatales-positivos': 'ant_pre_peri_postnatales_positivos',
            'alteraciones-anatomicas': 'alteraciones_anatomicas',
            'consumo-de-medicamentos': 'consumo_medicamentos',
            'consumo-de-toxicos': 'consumo_toxicos',
            'exposicion-a-medios-de-pantallas': 'exp_medios_pantallas',
            'trastornos-del-neurodesarrollo': 'trastorno_neurodesarrollo',
            'obesidad': 'obesidad',
            'hipertension-arterial': 'hipertension_arterial',
            'trastornos-del-aprendizaje': 'trastornos_aprendizaje',
            'trastornos-del-comportamiento': 'trastornos_comportamiento',
            'cefalea': 'cefalea',
            'resistencia-a-la-insulina': 'res_insulina',
            'depresion': 'depresion',
            'higienico-dietetico': 'higienico_dietetico',
            'cognitivo-conductual': 'cognitivo_conductual',
            'medicamentoso': 'medicamentoso',
            'trastornos-del-sueno': 'diagnostico_real'
        })

        columnas = [
            'sexo', 'edad', 'ant_patologicos_fam', 'ant_pre_peri_postnatales_positivos',
            'alteraciones_anatomicas', 'consumo_medicamentos', 'consumo_toxicos',
            'exp_medios_pantallas', 'trastorno_neurodesarrollo', 'obesidad',
            'hipertension_arterial', 'trastornos_aprendizaje', 'trastornos_comportamiento',
            'cefalea', 'res_insulina', 'depresion', 'higienico_dietetico',
            'cognitivo_conductual', 'medicamentoso', 'diagnostico_real'
        ]
        df_arff = df_arff[columnas]
        df_arff = df_arff.astype(int)

        # 2. Tomar todos los pacientes confirmados de la base de datos
        pacientes = Paciente.objects.exclude(diagnostico_real__isnull=True)
        data_db = [{
            'sexo': p.sexo,
            'edad': p.edad,
            'ant_patologicos_fam': p.ant_patologicos_fam,
            'ant_pre_peri_postnatales_positivos': p.ant_pre_peri_postnatales_positivos,
            'alteraciones_anatomicas': p.alteraciones_anatomicas,
            'consumo_medicamentos': p.consumo_medicamentos,
            'consumo_toxicos': p.consumo_toxicos,
            'exp_medios_pantallas': p.exp_medios_pantallas,
            'trastorno_neurodesarrollo': p.trastorno_neurodesarrollo,
            'obesidad': p.obesidad,
            'hipertension_arterial': p.hipertension_arterial,
            'trastornos_aprendizaje': p.trastornos_aprendizaje,
            'trastornos_comportamiento': p.trastornos_comportamiento,
            'cefalea': p.cefalea,
            'res_insulina': p.res_insulina,
            'depresion': p.depresion,
            'higienico_dietetico': p.higienico_dietetico,
            'cognitivo_conductual': p.cognitivo_conductual,
            'medicamentoso': p.medicamentoso,
            'diagnostico_real': p.diagnostico_real,

        } for p in pacientes]

        df_db = pd.DataFrame(data_db)

        # Si df_db está vacío, iguala columnas para evitar problemas en el concat
        if df_db.empty:
            df_db = pd.DataFrame(columns=df_arff.columns)

        # Unir ambos DataFrames
        df_total = pd.concat([df_arff, df_db], ignore_index=True)

        # Eliminar filas con NaN en diagnostico_real
        df_total = df_total.dropna(subset=['diagnostico_real'])

        # Asegúrate de que diagnostico_real es int
        df_total['diagnostico_real'] = df_total['diagnostico_real'].astype(int)

        # Ahora sí, split
        X = df_total.drop(columns=['diagnostico_real'])
        y = df_total['diagnostico_real']

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        # Calcular el IR (índice de desequilibrio)
        conteo = Counter(y_train)
        mayor = max(conteo.values())
        menor = min(conteo.values())
        IR = mayor / menor

        if IR >= 1.5:
            smoten = SMOTEN(random_state=42)
            X_train_res, y_train_res = smoten.fit_resample(X_train, y_train)
            print("smoten aplicado")
        else:
            X_train_res, y_train_res = X_train, y_train
            print("smoten no aplicado")

        # Escalar la edad DESPUÉS de SMOTEN
        from sklearn.preprocessing import MinMaxScaler
        scaler = MinMaxScaler()
        X_train_res = X_train_res.copy()
        X_test = X_test.copy()
        X_train_res['edad'] = scaler.fit_transform(X_train_res[['edad']])
        X_test['edad'] = scaler.transform(X_test[['edad']])

        clf = RandomForestClassifier(
            n_estimators=100, random_state=42, min_samples_split=10,
            min_samples_leaf=4, max_features='log2', max_depth=8
        )
        clf.fit(X_train_res, y_train_res)

        model_dir = os.path.join('ModeloIA')
        os.makedirs(model_dir, exist_ok=True)
        joblib.dump(clf, os.path.join(model_dir, 'rf_model.pkl'))
        joblib.dump(scaler, os.path.join(model_dir, 'scaler_edad.pkl'))

        print("Scaler min:", scaler.data_min_, "Scaler max:", scaler.data_max_)
        print("Edades únicas en entrenamiento:", X_train['edad'].unique())

        y_pred_test = clf.predict(X_test)
        report_test = classification_report(y_test, y_pred_test)
        matrix_test = confusion_matrix(y_test, y_pred_test).tolist()
        accuracy = accuracy_score(y_test, y_pred_test)

        # Importancia de características
        importancias = clf.feature_importances_
        nombres = list(X.columns)
        importancia_dict = [
            {"feature": nombre, "importance": float(imp)}
            for nombre, imp in zip(nombres, importancias)
        ]
        # Ordenar y tomar solo las 5 más importantes
        importancia_dict = sorted(importancia_dict, key=lambda x: x["importance"], reverse=True)[:5]

        # Guardar log en la base de datos
        ReentrenamientoLog.objects.create(
            usuario=request.user.username,
            total_pacientes=len(df_total),
            accuracy=accuracy,
            classification_report_test=report_test,
            confusion_matrix_test=matrix_test,
            importancia_caracteristicas=importancia_dict,  # Nuevo campo
        )

        log_path = os.path.join(model_dir, 'retrain_logs.txt')
        log_entry = {
            "usuario": request.user.username,
            "total_pacientes": len(df_total),
            "timestamp": pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S"),
            "accuracy": accuracy,
            "classification_report_test": report_test,
            "confusion_matrix_test": matrix_test,
        }
        with open(log_path, "a", encoding="utf-8") as f:
            f.write(json.dumps(log_entry) + "\n")

        # Actualizar pacientes confirmados como incluidos en reentrenamiento
        Paciente.objects.filter(diagnostico_real__isnull=False).update(incluido_en_reentrenamiento=True)

        return JsonResponse({
            'message': f'Modelo reentrenado con pacientes confirmados y ARFF.',
            'total_pacientes': len(df_total),
            'classification_report_test': report_test,
            'confusion_matrix_test': matrix_test,
            'confusion_matrix': matrix_test,
            'classification_report': report_test,
            'importancia_caracteristicas': importancia_dict,
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_logs_reentrenamiento(request):
    if not is_admin(request.user):
        return JsonResponse({'error': 'No tienes permiso para acceder a esta funcionalidad.'}, status=403)

    logs = ReentrenamientoLog.objects.order_by('-timestamp')  # <--- sin select_related
    data = []
    for idx, log in enumerate(logs, 1):
        data.append({
            "id": idx,
            "usuario": log.usuario,
            "total_pacientes": log.total_pacientes,
            "timestamp": log.timestamp.isoformat(),  # <-- ISO 8601, incluye zona horaria si está configurada
            "accuracy": log.accuracy,
            "classification_report_test": log.classification_report_test,
            "confusion_matrix_test": log.confusion_matrix_test,
            "importancia_caracteristicas": log.importancia_caracteristicas,
        })
    return JsonResponse(data, safe=False)

from api.models import ReentrenamientoLog

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def metricas_modelo_actual(request):
    # Devuelve el último log (modelo actual)
    ultimo_log = ReentrenamientoLog.objects.order_by('-timestamp').first()
    if not ultimo_log:
        return JsonResponse({'error': 'No hay métricas disponibles.'}, status=404)
    return JsonResponse({
        "accuracy": ultimo_log.accuracy,
        "classification_report_test": ultimo_log.classification_report_test,
        "confusion_matrix_test": ultimo_log.confusion_matrix_test,
        "importancia_caracteristicas": ultimo_log.importancia_caracteristicas,
    })