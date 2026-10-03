from django.conf import settings
from django.db import models


class Teacher(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="teacher_profile",
    )

    employee_number = models.CharField(
        max_length=50,
        unique=True,
        verbose_name="Matricule",
    )

    specialization = models.CharField(
        max_length=150,
        blank=True,
        verbose_name="Spécialité",
    )

    qualification = models.CharField(
        max_length=150,
        blank=True,
        verbose_name="Qualification",
    )

    hire_date = models.DateField(
        null=True,
        blank=True,
        verbose_name="Date d'embauche",
    )

    address = models.TextField(
        blank=True,
        verbose_name="Adresse",
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name="Actif",
    )

    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["user__last_name", "user__first_name"]
        verbose_name = "Enseignant"
        verbose_name_plural = "Enseignants"

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.employee_number}"
