"""
ASL Alphabet Classifier Training Script
Trains a MobileNetV2-based model on the Kaggle ASL Alphabet dataset
and exports to TensorFlow.js format for browser inference.

Usage:
    python scripts/train_asl_model.py

Requirements:
    pip install tensorflow tensorflowjs pillow
"""

import os
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
import tensorflowjs as tfjs

# Configuration
DATASET_PATH = os.path.join(os.path.dirname(__file__), '..', 'temp_asl', 'asl_alphabet_train')
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), '..', 'public', 'models', 'asl_classifier')
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 15

# ASL Letters (26 classes)
CLASSES = list('ABCDEFGHIJKLMNOPQRSTUVWXYZ')

def create_model(num_classes):
    """Create a MobileNetV2-based classifier for ASL letters."""
    base_model = MobileNetV2(
        weights='imagenet',
        include_top=False,
        input_shape=(IMG_SIZE, IMG_SIZE, 3)
    )
    
    # Freeze base model layers for transfer learning
    base_model.trainable = False
    
    # Add classification head
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.5)(x)
    predictions = Dense(num_classes, activation='softmax')(x)
    
    model = Model(inputs=base_model.input, outputs=predictions)
    return model

def main():
    print("=" * 60)
    print("ASL Alphabet Classifier Training")
    print("=" * 60)
    
    # Check dataset exists
    if not os.path.exists(DATASET_PATH):
        print(f"ERROR: Dataset not found at {DATASET_PATH}")
        print("Please ensure the Kaggle ASL Alphabet dataset is extracted there.")
        return
    
    # Data augmentation for training
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=15,
        width_shift_range=0.1,
        height_shift_range=0.1,
        zoom_range=0.1,
        horizontal_flip=False,  # ASL signs are not horizontally symmetric
        validation_split=0.2
    )
    
    print(f"\nLoading training data from: {DATASET_PATH}")
    
    # Training generator
    train_generator = train_datagen.flow_from_directory(
        DATASET_PATH,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training',
        classes=CLASSES
    )
    
    # Validation generator
    val_generator = train_datagen.flow_from_directory(
        DATASET_PATH,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation',
        classes=CLASSES
    )
    
    num_classes = len(train_generator.class_indices)
    print(f"Found {num_classes} classes: {list(train_generator.class_indices.keys())}")
    
    # Create model
    print("\nCreating MobileNetV2-based classifier...")
    model = create_model(num_classes)
    
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    model.summary()
    
    # Callbacks
    callbacks = [
        EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True),
        ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=2)
    ]
    
    # Train
    print("\nStarting training...")
    history = model.fit(
        train_generator,
        validation_data=val_generator,
        epochs=EPOCHS,
        callbacks=callbacks
    )
    
    # Evaluate
    print("\nEvaluating on validation set...")
    val_loss, val_acc = model.evaluate(val_generator)
    print(f"Validation Accuracy: {val_acc * 100:.2f}%")
    
    # Save as TensorFlow.js format
    print(f"\nExporting to TensorFlow.js format: {OUTPUT_PATH}")
    os.makedirs(OUTPUT_PATH, exist_ok=True)
    tfjs.converters.save_keras_model(model, OUTPUT_PATH)
    
    # Save class labels JSON for frontend use
    labels_path = os.path.join(OUTPUT_PATH, 'labels.json')
    import json
    with open(labels_path, 'w') as f:
        json.dump(CLASSES, f)
    
    print("\n" + "=" * 60)
    print("Training Complete!")
    print(f"Model saved to: {OUTPUT_PATH}")
    print(f"Labels saved to: {labels_path}")
    print("=" * 60)

if __name__ == '__main__':
    main()
