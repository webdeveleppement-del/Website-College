from django.conf import settings
from django.db import models


class Attendance(models.Model):

    class Status(models.TextChoices):
        PRESENT = "PRESENT", "Présent"
        ABSENT = "ABSENT", "Absent"
        RETARD = "RETARD", "Retard"
        JUSTIFIE = "JUSTIFIE", "Absence justifiée"

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="attendances",
        limit_choices_to={"role": "ELEVE"},
    )

    date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PRESENT,
    )

    arrival_time = models.TimeField(
        blank=True,
        null=True,
    )

    reason = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-date", "student__last_name"]
        unique_together = ["student", "date"]

    def __str__(self):
        return f"{self.student} - {self.date} - {self.status}"
