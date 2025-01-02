import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
import tensorflow as tf
from tensorflow.keras import Model, Sequential
from tensorflow.keras.layers import Dense, Input
from sklearn.metrics import classification_report
import tensorflow.keras as kr

# Cargar los datos desde tu archivo ARFF
from scipy.io import arff
data, meta = arff.loadarff("sueno.arff")
df = pd.DataFrame(data)


# Convertir columnas categóricas de bytes a cadenas
df = df.applymap(lambda x: x.decode('utf-8') if isinstance(x, bytes) else x)

# Codificar variables categóricas como números
label_encoders = {}
for col in df.select_dtypes(include=['object']).columns:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

#Esto es para ver q es 0 y q es 1
"""for col, le in label_encoders.items():
    print(f"Columna: {col}")
    print("Mapeo de clases:")
    for idx, clase in enumerate(le.classes_):
        print(f"  {clase} -> {idx}")
    print()"""

"""# Ver el mapeo de la columna 'trastornos-del-sueno'
encoder = label_encoders['sexo']  # Accede al encoder guardado
clases = encoder.classes_
print("Mapeo de clases:")
for idx, clase in enumerate(clases):
    print(f"{clase} -> {idx}")
"""
# Separar características (X) y objetivo (y)
X = df.drop('trastornos-del-sueno', axis=1)
y = df['trastornos-del-sueno']

# Escalar solo la columna edad
from sklearn.preprocessing import MinMaxScaler

# Seleccionar solo la columna de edad (segunda columna)
edad_columna = X.iloc[:, 1]  # '1' es el índice de la segunda columna

# Escalar solo la columna de edad
scaler = MinMaxScaler()  # Usando MinMaxScaler para escalar entre 0 y 1
X.iloc[:, 1] = scaler.fit_transform(edad_columna.values.reshape(-1, 1))

# Verificar las primeras filas después de escalar solo la edad
print(X.head())

# Dividir en conjuntos de entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Construir la red neuronal
model = Sequential([
    Dense(19, input_shape=(X_train.shape[1],), activation='relu'),
    Dense(4, activation='relu'),
    Dense(1, activation='sigmoid')
])


# Compilar el modelo
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Entrenar el modelo
history = model.fit(X_train, y_train, epochs=100, batch_size=32, validation_split=0.2, verbose=1)

# Evaluar el modelo
test_loss, test_accuracy = model.evaluate(X_test, y_test)
print(f'Test accuracy: {test_accuracy:.3f}')
# Resumen del modelo
model.summary()


print(f"Precisión de la red neuronal: {test_accuracy:.2f}")

# Predecir y generar reporte
y_pred_nn = (model.predict(X_test) > 0.5).astype("int32")
print(classification_report(y_test, y_pred_nn))


model.save("model.h5")

new_model = tf.keras.models.load_model('model.h5')
new_model.summary()
#Este codigo es para graficar

import matplotlib.pyplot as plt

# Graficar precisión
plt.plot(history.history['accuracy'], label='Entrenamiento')
plt.plot(history.history['val_accuracy'], label='Validación')
plt.title('Precisión')
plt.xlabel('Épocas')
plt.ylabel('Precisión')
plt.legend()
plt.show()

# Graficar pérdida
plt.plot(history.history['loss'], label='Entrenamiento')
plt.plot(history.history['val_loss'], label='Validación')
plt.title('Pérdida')
plt.xlabel('Épocas')
plt.ylabel('Pérdida')
plt.legend()
plt.show()
"""
import pandas as pd

# Calcular la media y desviación estándar de cada columna antes del escalado
medias_originales = X.mean()
desviaciones_originales = X.std()

# Calcular la media y desviación estándar de las columnas después del escalado
import numpy as np
medias_escaladas = np.mean(X_scaled, axis=0)  # Promedio por columna
desviaciones_escaladas = np.std(X_scaled, axis=0)  # Desviación estándar por columna

# Mostrar los resultados
print("Medias originales:")
print(medias_originales)
print("\nDesviaciones estándar originales:")
print(desviaciones_originales)

print("\nMedias después del escalado (deben estar cerca de 0):")
print(medias_escaladas)

print("\nDesviaciones estándar después del escalado (deben estar cerca de 1):")
print(desviaciones_escaladas)
"""