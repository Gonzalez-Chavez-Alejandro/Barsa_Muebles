from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.mail import send_mail
from django.conf import settings
from footer.models import FooterData

User = get_user_model()

def obtener_footer_data():
    footer = FooterData.objects.order_by('-id').first()
    if not footer:
        return None

    return {
        "emails": footer.emails,
        "phones": footer.phones,
        "locations": footer.locations,
        "socials": footer.socials,
    }

def enviar_correo_info_footers(usuario_email, usuario_nombre):
    footer = obtener_footer_data()

    emails = footer["emails"] if footer and footer["emails"] else ["No disponible"]
    phones = footer["phones"] if footer and footer["phones"] else ["No disponible"]
    locations = footer["locations"] if footer and footer["locations"] else ["No disponible"]
    socials = footer["socials"] if footer and footer["socials"] else {}

    socials_html = "<br>".join(
        f'<strong>{key}:</strong> <a href="{val}" style="color:#3b82f6;text-decoration:none;">{val}</a>'
        for key, val in socials.items()
    ) if socials else "No disponibles"

    mensaje_texto = f"""

"""

    mensaje_html = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {{
      font-family: 'Segoe UI', sans-serif;
      background-color: #f4f4f4;
      color: #333;
      padding: 30px;
    }}
    .container {{
      max-width: 600px;
      margin: auto;
      background-color: #ffffff;
      padding: 25px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.08);
    }}
    h2 {{
      color: #1f2937;
    }}
    p {{
      line-height: 1.6;
    }}
    .alert {{
      color: #dc2626;
      font-weight: bold;
      margin: 15px 0;
    }}
    .section-title {{
      font-weight: bold;
      color: #374151;
      margin-top: 20px;
    }}
    .info-block {{
      background: #f9fafb;
      padding: 10px 15px;
      border-left: 4px solid #3b82f6;
      margin-bottom: 10px;
    }}
    .footer {{
      margin-top: 30px;
      font-size: 0.9em;
      color: #666;
      text-align: center;
    }}
    a {{
      text-decoration: none;
      color: #3b82f6;
    }}
  </style>
</head>
<body>
  <div class="container">
    <h2>¡Bienvenido a Barsa Muebles, {usuario_nombre}!</h2>
    <p>
      Gracias por registrarte con nosotros. A continuación, te compartimos nuestros datos de contacto por si necesitas ayuda o deseas realizar un pedido.
    </p>
    <p class="alert">
      ⚠️ Aclaramos que desde la página <strong>NO se puede pagar</strong>. Además, si el producto tiene precio, debe confirmar que sea el actual, ya que esta es una página de encargos y esta en face de pruebas.
    </p>
    <p><strong>📌 Puedes comunicarte por teléfono, Instagram o asistir a nuestras sucursales</strong> para una atención más personalizada.</p>

    <div class="section-title">📞 Horario de atención:</div>
    <div class="info-block">
      Lunes a viernes: 9:00 a.m. – 6:00 p.m.<br>
      Domingo: 10:00 a.m. – 3:00 p.m.<br>
      Sábado: Cerrado
    </div>

    <div class="section-title">📧 Correos de contacto:</div>
    <div class="info-block">
      {"<br>".join(f'<a href="mailto:{email}">{email}</a>' for email in emails)}
    </div>

    <div class="section-title">📞 Teléfonos:</div>
    <div class="info-block">
      {"<br>".join(f'<a href="tel:{tel}">{tel}</a>' for tel in phones)}
    </div>

    <div class="section-title">📍 Ubicaciones:</div>
    <div class="info-block">
      {"<br>".join(locations)}
    </div>

    <div class="section-title">🌐 Redes sociales:</div>
    <div class="info-block">
      {socials_html}
    </div>

    <div class="footer">
      Distribuidora Mueblera Sahuayense – Barsa Muebles
    </div>
  </div>
</body>
</html>
"""

    send_mail(
        subject="¡Bienvenido a Barsa Muebles!",
        message=mensaje_texto,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[usuario_email],
        html_message=mensaje_html,
    )


# Ahora tu serializer

from rest_framework import serializers
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.validators import validate_email
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['last_name', 'email', 'ageUser', 'phoneUser', 'password']

    def validate_email(self, value):
        try:
            validate_email(value)
        except DjangoValidationError:
            raise serializers.ValidationError({"formato": "El formato del correo electrónico no es válido."})

        if not value.lower().endswith("@gmail.com"):
            raise serializers.ValidationError({"dominio": "Solo se permiten correos @gmail.com."})

        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError({"duplicado": "Este correo ya está registrado."})
        return value

    def validate_ageUser(self, value):
        if not isinstance(value, int) or value < 0:
            raise serializers.ValidationError("La edad debe ser un número positivo.")
        return value

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("La contraseña debe tener al menos 6 caracteres.")
        return value

    def create(self, validated_data):
        last_name = validated_data.pop('last_name').strip()
        base_username = last_name
        username = base_username
        counter = 1

        # Asegura username único aunque haya repetidos
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        user = User.objects.create_user(
            username=username,
            last_name=last_name,
            email=validated_data['email'],
            ageUser=validated_data['ageUser'],
            phoneUser=validated_data['phoneUser'],
            password=validated_data['password']
        )

        # Envía correo de bienvenida después de crear el usuario
        enviar_correo_info_footers(user.email, user.username)
        # Añade esta línea justo antes del return
        user._generated_username = username

        return user





from rest_framework import serializers
from django.contrib.auth import password_validation
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth import get_user_model

User = get_user_model()

class UserListSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'ageUser', 'phoneUser','ubicacionUser',  'stateUser', 'is_superuser', 'password','last_name',]
        extra_kwargs = {
            'password': {'write_only': True},
            'stateUser': {'read_only': True},  # Indica eliminación lógica
        }

    def validate_email(self, value):
        # Validar formato de email
        try:
            validate_email(value)
        except DjangoValidationError:
            raise serializers.ValidationError("Formato de correo electrónico inválido.")

        # Validar que email sea único en otros usuarios (excepto el actual)
        user_id = self.instance.id if self.instance else None
        if User.objects.exclude(id=user_id).filter(email__iexact=value).exists():
            raise serializers.ValidationError("Este correo electrónico ya está en uso.")

        return value

    def validate_ageUser(self, value):
        # Validar que sea entero positivo
        if not isinstance(value, int):
            raise serializers.ValidationError("La edad debe ser un número entero.")
        if value < 0:
            raise serializers.ValidationError("La edad no puede ser negativa.")
        return value

    def validate_password(self, value):
        if value:
            if len(value) < 6:
                raise serializers.ValidationError("La contraseña debe tener al menos 6 caracteres.")
            # Validar usando validadores de Django (si tienes configurados)
            password_validation.validate_password(value)
        return value

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
            raise serializers.ValidationError({"username": ["Usuario no encontrado."]})

        if not user.check_password(password):
            raise serializers.ValidationError({"password": ["Contraseña incorrecta."]})

        if not user.is_active:
            raise serializers.ValidationError({"username": ["Cuenta inactiva."]})

        data = super().validate({
            "username": user.username,
            "password": password
        })

        return data














# autentication/serializers.py

# autentication/serializers.py

from rest_framework import serializers
from .models import CustomUser

class SuperUserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'ageUser', 'phoneUser']
        extra_kwargs = {
            'email': {'required': True},
            'ageUser': {'required': True},
            'phoneUser': {'required': True},
        }

    def create(self, validated_data):
        return CustomUser.objects.create_superuser(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            ageUser=validated_data['ageUser'],
            phoneUser=validated_data['phoneUser']
        )

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este correo ya está registrado.")
        return value


# autentication/serializers.py
from rest_framework import serializers
from .models import CustomUser

class ActualizarUbicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['ubicacionUser']
