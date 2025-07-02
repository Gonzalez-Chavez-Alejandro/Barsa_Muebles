from django.core.mail import send_mail
from django.conf import settings
from footer.models import FooterData


def obtener_footer_data():
    # Obtener el último registro activo (asumiendo que es el más reciente)
    footer = FooterData.objects.order_by('-id').first()
    if not footer:
        return None
    
    return {
        "emails": footer.emails,
        "phones": footer.phones,
        "locations": footer.locations,
        "socials": footer.socials,
    }

def enviar_correo_info_footer(usuario_email, usuario_nombre):
    footer = obtener_footer_data()
    if not footer:
        # Si no hay info del footer, enviamos un correo básico
        mensaje_texto = (
            f"Hola {usuario_nombre},\n\n"
            "Gracias por tu pedido. Para cualquier consulta puedes contactarnos.\n\n"
            "Saludos,\nBarSamuebles"
        )
        send_mail(
            "Información de contacto - BarSamuebles",
            mensaje_texto,
            settings.EMAIL_HOST_USER,
            [usuario_email]
        )
        return

    # Formatear datos para el correo
    emails = "\n".join(footer["emails"]) if footer["emails"] else "No disponible"
    phones = "\n".join(footer["phones"]) if footer["phones"] else "No disponible"
    locations = "\n".join(footer["locations"]) if footer["locations"] else "No disponible"

    mensaje_texto = f"""
Hola {usuario_nombre},

Gracias por tu pedido. Aquí tienes nuestra información de contacto para cualquier consulta o verificación:

📧 Correos:
{emails}

📞 Teléfonos:
{phones}

📍 Ubicaciones:
{locations}

También puedes visitarnos en nuestras redes sociales.

Saludos,
BarSamuebles
"""

    send_mail(
        "Información de contacto - BarSamuebles",
        mensaje_texto,
        settings.EMAIL_HOST_USER,
        [usuario_email]
    )
