from rest_framework import viewsets
from model.users.models import CustomUser
from model.users.serializers import CustomUserSerializer, CustomUserCreateSerializer
from rest_framework.permissions import AllowAny

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    permission_classes = [AllowAny]  # Дозволяємо всім створювати користувачів

    def get_serializer_class(self):
        if self.action == "create":
            return CustomUserCreateSerializer
        return CustomUserSerializer
