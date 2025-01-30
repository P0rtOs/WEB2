from djoser.serializers import UserCreateSerializer, UserSerializer
from model.users.models import CustomUser

class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta:
        model = CustomUser
        fields = ("id", "email", "password")

class CustomUserSerializer(UserSerializer):
    class Meta:
        model = CustomUser
        fields = ("id", "email", "first_name", "last_name")
