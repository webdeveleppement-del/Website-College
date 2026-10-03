from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.accounts.permissions import IsAdmin

from .models import Student
from .serializers import StudentSerializer


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.select_related(
        "user",
        "classe",
    ).all()

    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method in {"POST", "PUT", "PATCH", "DELETE"}:
            return [IsAdmin()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user

        if getattr(user, "role", None) == "ELEVE":
            return queryset.filter(user=user)

        return queryset
