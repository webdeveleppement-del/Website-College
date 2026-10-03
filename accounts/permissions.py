from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """
    Autorise uniquement les administrateurs.
    """

    def has_permission(self, request, view):

        return (
            request.user
            and request.user.is_authenticated
            and (
                request.user.is_superuser
                or request.user.role == "ADMIN"
            )
        )


class IsTeacher(BasePermission):
    """
    Autorise les enseignants.
    """

    def has_permission(self, request, view):

        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "ENSEIGNANT"
        )


class IsStudent(BasePermission):
    """
    Autorise les élèves.
    """

    def has_permission(self, request, view):

        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "ELEVE"
        )


class IsParent(BasePermission):
    """
    Autorise les parents.
    """

    def has_permission(self, request, view):

        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "PARENT"
        )


class IsAdminOrTeacher(BasePermission):
    """
    Autorise administrateurs et enseignants.
    """

    def has_permission(self, request, view):

        if not request.user:
            return False

        if not request.user.is_authenticated:
            return False

        return (
            request.user.is_superuser
            or request.user.role in [
                "ADMIN",
                "ENSEIGNANT",
            ]
        )


class IsAuthenticatedUser(BasePermission):

    def has_permission(self, request, view):

        return (
            request.user
            and request.user.is_authenticated
        )
