from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Разрешает доступ только администраторам (is_staff=True).
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)

class IsOrganizer(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.user_type == "organizer")

class IsEventOwnerOrStaff(permissions.BasePermission):
    """
    Позволяет выполнять изменение и удаление события,
    если пользователь является администратором (is_staff True)
    или если он является организатором (создателем) события.
    """
    def has_object_permission(self, request, view, obj):
        # Разрешаем безопасные методы для всех
        if request.method in permissions.SAFE_METHODS:
            return True
        # Администратор всегда имеет доступ
        if request.user and request.user.is_staff:
            return True
        # Иначе – только если пользователь является организатором
        return obj.organizer == request.user
