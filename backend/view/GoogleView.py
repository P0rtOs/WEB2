# yourapp/views.py
import requests
from django.contrib.auth import get_user_model
from rest_framework import status, views
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class GoogleLoginView(views.APIView):
    """
    Приймаємо id_token від Google, перевіряємо його, створюємо або отримуємо користувача
    і повертаємо JWT токени.
    """
    def post(self, request):
        id_token = request.data.get("token")
        if not id_token:
            return Response({"error": "Token is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Валідація id_token через Google API
        google_response = requests.get(
            "https://www.googleapis.com/oauth2/v3/tokeninfo",
            params={"id_token": id_token}
        )

        if google_response.status_code != 200:
            return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)

        token_info = google_response.json()
        email = token_info.get("email")
        if not email:
            return Response({"error": "Email not provided by Google."}, status=status.HTTP_400_BAD_REQUEST)

        # Отримуємо або створюємо користувача
        user, created = User.objects.get_or_create(
            email=email,
            defaults={"username": email}  # або інший унікальний параметр
        )
        if created:
            user.role = 'user'  # встановлюємо роль за замовчуванням, якщо потрібно
            user.save()

        # Генеруємо JWT токени, використовуючи simplejwt
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        })
