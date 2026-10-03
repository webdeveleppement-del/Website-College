from django.core.exceptions import ValidationError
from django.db import models


class TimetableEntry(models.Model):

    class Day(models.TextChoices):

        MONDAY = "MONDAY", "Lundi"
        TUESDAY = "TUESDAY", "Mardi"
        WEDNESDAY = "WEDNESDAY", "Mercredi"
        THURSDAY = "THURSDAY", "Jeudi"
        FRIDAY = "FRIDAY", "Vendredi"
        SATURDAY = "SATURDAY", "Samedi"

    school_class = models.ForeignKey(
        "classes.SchoolClass",
        on_delete=models.CASCADE,
        related_name="timetable_entries",
        verbose_name="Classe",
    )

    subject = models.ForeignKey(
        "subjects.Subject",
        on_delete=models.CASCADE,
        related_name="timetable_entries",
        verbose_name="Matière",
    )

    teacher = models.ForeignKey(
        "teachers.Teacher",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="timetable_entries",
        verbose_name="Enseignant",
    )

    day = models.CharField(
        max_length=20,
        choices=Day.choices,
        verbose_name="Jour",
    )

    start_time = models.TimeField(
        verbose_name="Heure de début",
    )

    end_time = models.TimeField(
        verbose_name="Heure de fin",
    )

    room = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Salle",
    )

    notes = models.TextField(
        blank=True,
        verbose_name="Notes",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:

        ordering = [
            "day",
            "start_time",
        ]

        verbose_name = "Cours"
        verbose_name_plural = "Emploi du temps"

    def clean(self):

        if self.start_time >= self.end_time:

            raise ValidationError(
                {
                    "end_time": (
                        "L'heure de fin doit être "
                        "postérieure à l'heure de début."
                    )
                }
            )

    def __str__(self):

        return (
            f"{self.school_class} - "
            f"{self.subject} - "
            f"{self.get_day_display()} "
            f"{self.start_time}"
        )
