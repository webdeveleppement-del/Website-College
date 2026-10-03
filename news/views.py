from django.utils import timezone
from rest_framework import filters, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import News
from .serializers import NewsSerializer


class NewsViewSet(viewsets.ModelViewSet):

    queryset = News.objects.select_related(
        "author",
    ).all()

    serializer_class = NewsSerializer

    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    search_fields = [
        "title",
        "category",
        "excerpt",
        "content",
    ]

    ordering_fields = [
        "published_at",
        "created_at",
        "title",
    ]

    def get_permissions(self):

        if self.action in [
            "list",
            "retrieve",
        ]:
            return [
                AllowAny()
            ]

        return [
            IsAuthenticated()
        ]

    def get_queryset(self):

        queryset = super().get_queryset()

        if self.request.user.is_authenticated:

            if (
                self.request.user.is_superuser
                or self.request.user.role == "ADMIN"
            ):
                return queryset

        return queryset.filter(
            is_published=True,
            published_at__lte=timezone.now(),
        )

    def perform_create(self, serializer):

        serializer.save(
            author=self.request.user
        )
