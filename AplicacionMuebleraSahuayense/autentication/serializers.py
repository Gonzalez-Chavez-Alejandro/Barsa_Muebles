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
from django.contrib.auth import get_user_model

class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'ageUser', 'phoneUser', 'stateUser', 'is_superuser']




















