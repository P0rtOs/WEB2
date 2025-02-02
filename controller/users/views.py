from rest_framework import viewsets
from model.users.models import CustomUser
from model.users.serializers import CustomUserSerializer
from rest_framework.permissions import IsAuthenticated

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]
