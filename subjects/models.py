from django.db import models


class Subject(models.Model):
    name = models.CharField(
        max_length=150,
        unique=True,
        verbose_name="Matière",
    )

    code = models.CharField(
        max_length=30,
        unique=True,
        verbose_name="Code",
    )

    coefficient = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=1,
        verbose_name="Coefficient",
    )

    description = models.TextField(
        blank=True,
        verbose_name="Description",
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name="Active",
    )

    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Matière"
        verbose_name_plural = "Matières"

    def __str__(self):
        return f"{self.name} ({self.code})"
