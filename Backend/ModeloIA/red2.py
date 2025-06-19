import pandas as pd
import numpy as np
from scipy.io import arff
from imblearn.over_sampling import SMOTEN
from sklearn.svm import SVC
from sklearn.ensemble import (RandomForestClassifier,
                              ExtraTreesClassifier, AdaBoostClassifier)
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.naive_bayes import GaussianNB
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import RandomizedSearchCV, StratifiedKFold, cross_val_score, learning_curve, permutation_test_score
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve, RocCurveDisplay
from sklearn.calibration import calibration_curve
import matplotlib.pyplot as plt
import joblib
import shap
from scipy.stats import friedmanchisquare
import scikit_posthocs as sp


# --- 1. Carga de Datos desde ARFF ---
print("Cargando datos desde sueno - copia.arff ...")
data_arff, _ = arff.loadarff('sueno - copia.arff')
df = pd.DataFrame(data_arff)

# Decodificar columnas tipo bytes (solo si es necesario)
for col in df.select_dtypes([object]):
    df[col] = df[col].str.decode('utf-8')

# Renombrar columnas para que coincidan con el resto del script
df = df.rename(columns={
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
    'trastornos-del-sueno': 'diagnostico_real',
    # 'id' se ignora
})

# Elimina columna 'id' si existe
if 'id' in df.columns:
    df = df.drop(columns=['id'])

print("Datos cargados.")

# Separar variables y clase
X = df.drop(columns=['diagnostico_real'])
y = df['diagnostico_real'].astype(int)  # Asegura que sea int

# División en entrenamiento y prueba (80% train, 20% test)
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Calcular IR (Índice de Desbalance) en el set de entrenamiento
conteos = y_train.value_counts()
mayoritaria = conteos.max()
minoritaria = conteos.min()
IR = mayoritaria / minoritaria
print(f"Índice de desbalance (IR): {IR:.2f}")

# Escalar edad solo con datos de entrenamiento
from sklearn.preprocessing import MinMaxScaler
scaler = MinMaxScaler()
X_train['edad'] = scaler.fit_transform(X_train[['edad']])
X_test['edad'] = scaler.transform(X_test[['edad']])
print("Scaler edad")
print(X_test)
print(len(X_train), len(X_test))

# Aplicar SMOTEN solo si IR > 1.5
if IR > 1.5:
    print("Aplicando SMOTEN por desbalance de clases...")
    smote = SMOTEN(random_state=42)
    X_train_res, y_train_res = smote.fit_resample(X_train, y_train)
    # Mostrar conteo de clases antes y después de SMOTEN
    print("Distribución original de clases en entrenamiento:")
    print(y_train.value_counts())
    print("\nDistribución de clases después de SMOTEN:")
    print(pd.Series(y_train_res).value_counts())
    # Calcular cuántos casos sintéticos se crearon por clase
    creados = pd.Series(y_train_res).value_counts() - y_train.value_counts()
    print("\nCasos sintéticos creados por SMOTEN (por clase):")
    print(creados)
else:
    print("No se aplica SMOTEN (IR <= 1.5).")
    X_train_res, y_train_res = X_train, y_train

print("Datos de entrenamiento y prueba preparados.")

# --- 2. Búsqueda de Hiperparámetros y Entrenamiento de Modelos ---
cv_strat = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
param_dist = {
    "SVC": {
        'C': [0.1, 0.5, 1, 10, 50, 100],
        'gamma': ['scale', 'auto', 0.001, 0.01, 0.1, 1]
    },
    "Random Forest": {
        'n_estimators': [ 100, 150],
        'max_depth': [5, 7,8,9],
        'min_samples_split': [10, 12, 15, 18, 20],
        'min_samples_leaf': [ 3, 4, 5,6,8],
        'max_features': ['log2', 'sqrt']
    
    },
    "Gradient Boosting": {
        'n_estimators': [50, 100, 200],
        'learning_rate': [0.01, 0.05, 0.1, 0.2],
        'max_depth': [3, 5, 7]
    },
    "Logistic Regression": {
        'C': [0.1, 0.5, 1, 10, 50, 100],
        'solver': ['lbfgs', 'liblinear']
    },
    "KNN": {
        'n_neighbors': [3, 5, 7, 9]
    },
    "Decision Tree": {
        'max_depth': [None, 3, 5, 7, 10]
    },
    "Naive Bayes": {},
    "Extra Trees": {
        'n_estimators': [50, 100, 200],
        'max_depth': [None, 5, 10, 15]
    },
    "AdaBoost": {
        'n_estimators': [50, 100, 200],
        'learning_rate': [0.01, 0.1, 1.0]
    },
    "MLP": {
        'hidden_layer_sizes': [ (32, 16), (64, 32),(70, 64), (16,8)],
        'activation': ['relu'],
        'solver': ['adam'], # Adam suele ser un buen punto de partida
        'alpha': [0.0001, 0.001, 0.01, 0.1], # Regularización L2
        'max_iter': [300, 500, 700, 1000] # Aumentar opciones de max_iter
    
    }
}

modelos_base = {
    "SVC": SVC(kernel='rbf', probability=True, random_state=42),
    "Random Forest": RandomForestClassifier(random_state=42),
    #"Gradient Boosting": GradientBoostingClassifier(random_state=42),
    "Logistic Regression": LogisticRegression(random_state=42, max_iter=1000),
    "KNN": KNeighborsClassifier(),
    "Decision Tree": DecisionTreeClassifier(random_state=42),
    "Naive Bayes": GaussianNB(),
    "Extra Trees": ExtraTreesClassifier(random_state=42),
    "AdaBoost": AdaBoostClassifier(random_state=42),
    "MLP": MLPClassifier(random_state=42, early_stopping=True, n_iter_no_change=10, validation_fraction=0.1) 
}

modelos_cv = {}
print("\nOptimizando hiperparámetros con RandomizedSearchCV...")
for nombre, modelo in modelos_base.items():
    if param_dist[nombre]:
        search = RandomizedSearchCV(
            modelo,
            param_distributions=param_dist[nombre],
            n_iter=10,
            cv=cv_strat,
            scoring='accuracy',
            n_jobs=-1,
            random_state=42,
            verbose=0
        )
        search.fit(X_train_res, y_train_res)
        modelos_cv[nombre] = search.best_estimator_
        print(f"{nombre}: mejores hiperparámetros -> {search.best_params_}")
    else:
        modelo.fit(X_train_res, y_train_res)
        modelos_cv[nombre] = modelo

# Usar el mejor SVC para predicción individual
best_svc = modelos_cv["SVC"]
joblib.dump(best_svc, 'best_svc_model.pkl')

# --- 3. Predicción de Instancia Específica ---
print("\n--- Predicción para instancia específica ---")
nuevo_paciente_raw = np.array([[0,5,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1]], dtype=np.float32)
try:
    scaler_edad = joblib.load('scaler_edad.pkl')
    nuevo_paciente_scaled_np = nuevo_paciente_raw.copy()
    edad_a_escalar = nuevo_paciente_scaled_np[:, 1].reshape(-1, 1)
    edad_escalada = scaler_edad.transform(edad_a_escalar)
    nuevo_paciente_scaled_np[:, 1] = edad_escalada.flatten()
except FileNotFoundError:
    print("ADVERTENCIA: No se encontró 'scaler_edad.pkl'. La columna 'edad' no se escalará.")
    nuevo_paciente_scaled_np = nuevo_paciente_raw.copy()

nuevo_paciente_df = pd.DataFrame(nuevo_paciente_scaled_np, columns=X_train.columns)
print("Instancia a predecir (edad escalada si scaler disponible):\n", nuevo_paciente_df)

print("\nPredicciones para la instancia:")
for nombre, modelo in modelos_cv.items():
    if hasattr(modelo, "predict_proba"):
        probas = np.round(modelo.predict_proba(nuevo_paciente_df), 3)
        print(f"{nombre:20s}: Clase={modelo.predict(nuevo_paciente_df)[0]}, Probas={probas}")
    else:
        print(f"{nombre:20s}: Clase={modelo.predict(nuevo_paciente_df)[0]}")

# --- 4. Evaluación de Modelos en Test ---
print("\n--- Evaluación de modelos en conjunto de prueba ---")
for nombre, modelo in modelos_cv.items():
    y_pred = modelo.predict(X_test)
    print(f"\n{nombre:20s}")
    print("Matriz de confusión:")
    print(confusion_matrix(y_test, y_pred))
    print("Reporte de clasificación:")
    print(classification_report(y_test, y_pred))
    if hasattr(modelo, "predict_proba"):
        # Obtener las probabilidades para la clase positiva (asumiendo que es la clase 1)
        y_pred_proba = modelo.predict_proba(X_test)[:, 1]
        auc = roc_auc_score(y_test, y_pred_proba)
        print(f"AUC-ROC: {auc:.4f}")
    else:
        # Algunos modelos (como SVC sin probability=True) no tienen predict_proba
        # O si tu modelo no lo soporta por alguna razón.
        print("AUC-ROC: No disponible (modelo no tiene predict_proba)")



# --- 6. Comparación Estadística Final con Cross-Validation ---
print("\n--- Comparación Estadística con Cross-Validation (modelos optimizados) ---")
resultados_cv_por_fold = []
for nombre, modelo in modelos_cv.items():
    scores = cross_val_score(modelo, X_train_res, y_train_res, cv=cv_strat, scoring='accuracy', n_jobs=-1)
    resultados_cv_por_fold.append(scores)
    print(f"{nombre:20s}: {scores.mean():.4f} ± {scores.std():.4f}")
    print (scores)


# --- 7.1 Curva de Aprendizaje (Random Forest, validación cruzada) ---
print("\n--- Curva de aprendizaje (Random Forest, validación cruzada) ---")
try:
    train_sizes, train_scores, val_scores = learning_curve(
        modelos_cv["Random Forest"], X_train_res, y_train_res, cv=cv_strat, scoring='accuracy', n_jobs=-1,
        train_sizes=np.linspace(0.1, 1.0, 10), shuffle=True, random_state=42
    )
    train_scores_mean = np.mean(train_scores, axis=1)
    val_scores_mean = np.mean(val_scores, axis=1)
    plt.figure()
    plt.plot(train_sizes, train_scores_mean, 'o-', label="Entrenamiento")
    plt.plot(train_sizes, val_scores_mean, 'o-', label="Validación (CV)")
    plt.xlabel("Tamaño del conjunto de entrenamiento")
    plt.ylabel("Precisión")
    plt.title("Curva de aprendizaje - Random Forest")
    plt.legend()
    plt.tight_layout()
    plt.show()
except Exception as e:
    print(f"Error generando curva de aprendizaje: {e}")

# --- 7.2 Prueba de Permutación (Random Forest, conjunto de prueba) ---
print("\n--- Prueba de permutación (Random Forest, conjunto de prueba) ---")
try:
    from sklearn.utils import shuffle
    def permutation_test_on_test(model, X_test, y_test, n_permutations=100):
        score = model.score(X_test, y_test)
        perm_scores = []
        for _ in range(n_permutations):
            y_test_perm = shuffle(y_test, random_state=None)
            perm_scores.append(model.score(X_test, y_test_perm))
        perm_scores = np.array(perm_scores)
        pvalue = (np.sum(perm_scores >= score) + 1) / (n_permutations + 1)
        return score, perm_scores, pvalue

    score, perm_scores, pvalue = permutation_test_on_test(
        modelos_cv["Random Forest"], X_test, y_test, n_permutations=100
    )
    print(f"Precisión real en test: {score:.4f}")
    print(f"P-value de permutación: {pvalue:.4f}")
    plt.figure()
    plt.hist(perm_scores, bins=20, alpha=0.7, label="Permutaciones")
    plt.axvline(score, color='red', linestyle='--', label="Precisión real")
    plt.xlabel("Precisión")
    plt.ylabel("Frecuencia")
    plt.title("Prueba de permutación - Random Forest (test)")
    plt.legend()
    plt.tight_layout()
    plt.show()
except Exception as e:
    print(f"Error en prueba de permutación: {e}")

# --- 7.3 Curva de Calibración (Random Forest, conjunto de prueba) ---
print("\n--- Curva de calibración (Random Forest, test) ---")
try:
    y_prob = modelos_cv["Random Forest"].predict_proba(X_test)[:, 1]
    prob_true, prob_pred = calibration_curve(y_test, y_prob, n_bins=10)
    plt.figure()
    plt.plot(prob_pred, prob_true, marker='o', label='Random Forest')
    plt.plot([0, 1], [0, 1], linestyle='--', color='gray', label='Perfectamente calibrado')
    plt.xlabel("Probabilidad predicha")
    plt.ylabel("Probabilidad real")
    plt.title("Curva de calibración - Random Forest (test)")
    plt.legend()
    plt.tight_layout()
    plt.show()
except Exception as e:
    print(f"Error generando curva de calibración: {e}")

# --- 7.4 Curva ROC (Random Forest, conjunto de prueba) ---
print("\n--- Curva ROC (Random Forest, test) ---")
try:
    y_prob = modelos_cv["Random Forest"].predict_proba(X_test)[:, 1]
    fpr, tpr, thresholds = roc_curve(y_test, y_prob)
    plt.figure()
    plt.plot(fpr, tpr, label='Random Forest (AUC = {:.2f})'.format(roc_auc_score(y_test, y_prob)))
    plt.plot([0, 1], [0, 1], linestyle='--', color='gray')
    plt.xlabel("Tasa de falsos positivos")
    plt.ylabel("Tasa de verdaderos positivos")
    plt.title("Curva ROC - Random Forest (test)")
    plt.legend()
    plt.tight_layout()
    plt.show()
except Exception as e:
    print(f"Error generando curva ROC: {e}")

print("\nScript completado.")