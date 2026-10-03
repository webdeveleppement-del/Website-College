from django.db import models


class News(models.Model):

    title = models.CharField(
        max_length=255,
        verbose_name="Titre",
    )

    slug = models.SlugField(
        max_length=255,
        unique=True,
        verbose_name="Slug",
    )

    category = models.CharField(
        max_length=100,
        default="Actualité",
        verbose_name="Catégorie",
    )

    excerpt = models.TextField(
        blank=True,
        verbose_name="Résumé",
    )

    content = models.TextField(
        verbose_name="Contenu",
    )

    image = models.ImageField(
        upload_to="news/",
        blank=True,
        null=True,
        verbose_name="Image",
    )

    author = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="news_articles",
        verbose_name="Auteur",
    )

    is_published = models.BooleanField(
        default=False,
        verbose_name="Publié",
    )

    published_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Date de publication",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:

        ordering = [
            "-published_at",
            "-created_at",
        ]

        verbose_name = "Actualité"
        verbose_name_plural = "Actualités"

    def __str__(self):

        return self.title
