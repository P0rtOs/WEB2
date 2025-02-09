from djoser.serializers import UserCreateSerializer, UserSerializer
from model.users.models import CustomUser

class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta:
        model = CustomUser
        fields = ("id", "email", "password")
        extra_kwargs = {"password": {"write_only": True}}

class CustomUserSerializer(UserSerializer):
    class Meta:
        model = CustomUser
        fields = ("id", "email", "username", "first_name", "last_name", "user_type")
