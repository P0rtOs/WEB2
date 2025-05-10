import requests
from django.contrib.auth import get_user_model, authenticate
from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegistrationSerializer, GoogleAuthSerializer, CustomUserSerializer  
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny

User = get_user_model()

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer

class UserLoginView(views.APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        # Передаем email как username
        user = authenticate(request, username=email, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Неверные учетные данные'}, status=status.HTTP_401_UNAUTHORIZED)


class ToggleAdminView(views.APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        user = request.user
        # Переключаем is_staff: если был False – становится True, иначе наоборот.
        user.is_staff = not user.is_staff
        user.save()
        serializer = CustomUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GoogleLoginView(views.APIView):
    """
    Принимает id_token от Google, проверяет его, создаёт или получает пользователя
    и возвращает JWT токены.
    """
    permission_classes = [AllowAny]
    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response({"error": "Token is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            google_response = requests.get(
                "https://www.googleapis.com/oauth2/v3/tokeninfo",
                params={"id_token": token},
                timeout=5
            )
        except requests.RequestException as e:
            return Response({"error": f"Ошибка запроса к Google: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if google_response.status_code != 200:
            return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)

        token_info = google_response.json()
        email = token_info.get("email")
        if not email:
            return Response({"error": "Email не получен от Google."}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(
            email=email,
            defaults={"username": email, "user_type": "client"}
        )
        if created:
            # Если необходимо, можно задать другой тип для пользователей Google
            user.user_type = "client"
            user.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        })
