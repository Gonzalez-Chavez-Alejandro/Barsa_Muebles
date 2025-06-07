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



# autentication/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db.models import ProtectedError
from .models import CustomUser
from .serializers import UserListSerializer
from .permissions import IsAdminOrIsSelf  # importa el permiso personalizado

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserListSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrIsSelf]

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError as e:
            return Response(
                {"error": "No se puede eliminar el usuario porque tiene datos relacionados."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

