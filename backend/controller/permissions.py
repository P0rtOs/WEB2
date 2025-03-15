from rest_framework import permissions

class IsOrganizer(permissions.BasePermission):
    """
    Дозволяє доступ лише користувачам з роллю "organizer" для методів, що змінюють дані.
    """
    def has_permission(self, request, view):
        # Для безпечних методів (GET, HEAD, OPTIONS) доступ дозволено
        if request.method in permissions.SAFE_METHODS:
            return True
        # Для методів, що змінюють дані, перевіряємо, що користувач аутентифікований і має роль "organizer"
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.user_type == "organizer"
        )
