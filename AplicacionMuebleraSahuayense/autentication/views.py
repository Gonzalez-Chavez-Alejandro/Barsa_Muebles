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
        users = User.objects.filter(stateUser=True)
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
            instance = self.get_object()
            instance.stateUser = False
            instance.save()
            return Response({"detail": "El usuario ha sido eliminado correctamente"},
                            status=status.HTTP_200_OK)
        except ProtectedError as e:
            return Response(
                {"error": "Ocurrio un error al tratar de eliminar el usuario."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

# autentication/views.py

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
