from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'ageUser', 'phoneUser', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            ageUser=validated_data['ageUser'],
            phoneUser=validated_data['phoneUser'],
            password=validated_data['password']
        )

        return user
    






# serializers.py
from rest_framework import serializers

class UserListSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'ageUser', 'phoneUser', 'stateUser', 'is_superuser', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
            'stateUser':{'read_only': True}, # <- Se cambio porque este campo indica eliminación
        }

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)
        instance.save()
        return instance





# autentication/serializers.py

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'username'

    def validate(self, attrs):
        login = attrs.get("username")
        password = attrs.get("password")

        # Buscar por correo o username
        user = User.objects.filter(email=login).first() or User.objects.filter(username=login).first()

        if user is None:
            raise serializers.ValidationError({"detail": "Usuario no encontrado."})

        if not user.check_password(password):
            raise serializers.ValidationError({"detail": "Contraseña incorrecta."})

        if not user.is_active:
            raise serializers.ValidationError({"detail": "Cuenta inactiva."})

        data = super().validate({
            "username": user.username,
            "password": password
        })

        return data















