from djoser.serializers import UserCreateSerializer, UserSerializer
from model.users.models import CustomUser

class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta:
        model = CustomUser
        # Ми більше не вимагаємо username, адже його встановлюємо автоматично
        fields = ("id", "email", "password")
        extra_kwargs = {"password": {"write_only": True}}

class CustomUserSerializer(UserSerializer):
    class Meta:
        model = CustomUser
        fields = ("id", "email", "username", "first_name", "last_name")
