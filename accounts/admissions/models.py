from django.db import models


class Admission(models.Model):

    class Status(models.TextChoices):

        PENDING = "PENDING", "En attente"
        REVIEWING = "REVIEWING", "En étude"
        ACCEPTED = "ACCEPTED", "Acceptée"
        REJECTED = "REJECTED", "Refusée"

    first_name = models.CharField(
        max_length=100,
        verbose_name="Prénom",
    )

    last_name = models.CharField(
        max_length=100,
        verbose_name="Nom",
    )

    email = models.EmailField(
        verbose_name="Email",
    )

    phone = models.CharField(
        max_length=30,
        verbose_name="Téléphone",
    )

    date_of_birth = models.DateField(
        null=True,
        blank=True,
        verbose_name="Date de naissance",
    )

    requested_class = models.ForeignKey(
        "classes.SchoolClass",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="admission_requests",
        verbose_name="Classe demandée",
    )

    parent_name = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="Nom du parent",
    )

    parent_phone = models.CharField(
        max_length=30,
        blank=True,
        verbose_name="Téléphone du parent",
    )

    message = models.TextField(
        blank=True,
        verbose_name="Message",
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        verbose_name="Statut",
    )

    admin_note = models.TextField(
        blank=True,
        verbose_name="Note administrative",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:

        ordering = [
            "-created_at",
        ]

        verbose_name = "Demande d'admission"
        verbose_name_plural = "Demandes d'admission"

    def __str__(self):

        return (
            f"{self.first_name} "
            f"{self.last_name}"
        )
