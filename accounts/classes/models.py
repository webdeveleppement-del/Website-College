from django.db import models


class SchoolClass(models.Model):
    name = models.CharField(max_length=100, verbose_name="Nom")
    level = models.CharField(max_length=100, verbose_name="Niveau")
    academic_year = models.CharField(
        max_length=20,
        verbose_name="Année scolaire",
    )
    room = models.CharField(
        max_length=50,
        blank=True,
        verbose_name="Salle",
    )
    capacity = models.PositiveIntegerField(
        default=40,
        verbose_name="Capacité",
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Active",
    )
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["level", "name"]
        verbose_name = "Classe"
        verbose_name_plural = "Classes"

    def __str__(self):
        return f"{self.name} - {self.academic_year}"
