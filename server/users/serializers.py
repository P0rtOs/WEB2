from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        # Заменяем 'role' на 'user_type'
        fields = ('id', 'email', 'username', 'password', 'user_type')

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class GoogleAuthSerializer(serializers.Serializer):
    token = serializers.CharField()

    def validate(self, data):
        # Можно добавить дополнительную валидацию
        return data

    def create(self, validated_data):
        # Этот метод не используется, логика реализована в представлении
        pass
