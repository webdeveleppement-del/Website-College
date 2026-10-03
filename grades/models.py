from django.conf import settings
from django.db import models


class Grade(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="grades",
        limit_choices_to={"role": "ELEVE"},
        verbose_name="Élève",
    )

    subject = models.ForeignKey(
        "subjects.Subject",
        on_delete=models.CASCADE,
        related_name="grades",
        verbose_name="Matière",
    )

    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="given_grades",
        limit_choices_to={"role": "ENSEIGNANT"},
        verbose_name="Enseignant",
    )

    value = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        verbose_name="Note",
    )

    coefficient = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=1,
        verbose_name="Coefficient",
    )

    assessment = models.CharField(
        max_length=150,
        blank=True,
        verbose_name="Évaluation",
    )

    comment = models.TextField(
        blank=True,
        verbose_name="Commentaire",
    )

    date = models.DateField(
        auto_now_add=True,
        verbose_name="Date",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Créé le",
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Modifié le",
    )

    class Meta:
        ordering = ["-date", "-created_at"]
        verbose_name = "Note"
        verbose_name_plural = "Notes"

    def __str__(self):
        return (
            f"{self.student} - "
            f"{self.subject} - "
            f"{self.value}/20"
        )
