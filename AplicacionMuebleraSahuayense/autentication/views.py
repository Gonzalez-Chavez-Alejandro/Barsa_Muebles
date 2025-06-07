from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from autentication.serializers import RegisterSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "El usuario se creo correctamente"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.contrib.auth import get_user_model
from rest_framework import status

User = get_user_model()

class ListUsersView(APIView):
    permission_classes = [IsAdminUser]  # Solo admins pueden acceder

    def get(self, request):
        users = User.objects.all()
        data = []
        for u in users:
            data.append({
                'id': u.id,
                'username': u.username,
                'email': u.email,
                'phoneUser': u.phoneUser,
                'is_superuser': u.is_superuser,
                # agrega campos extra que uses, como phoneUser, etc
            })
        return Response(data, status=status.HTTP_200_OK)
