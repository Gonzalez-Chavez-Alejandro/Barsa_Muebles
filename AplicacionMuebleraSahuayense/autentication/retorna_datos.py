# retorna_datos.py
# retorna_datos.py
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "phoneUser": user.phoneUser,
            "stateUser": user.stateUser,
            "ageUser": user.ageUser,  # <--- agregar este campo
            "is_superuser": user.is_superuser,
        }
        return Response(data)


