from django.urls import path

from .views import dashboard_overview, public_statistics


urlpatterns = [
    path(
        "overview/",
        dashboard_overview,
        name="dashboard-overview",
    ),
    path(
        "public-statistics/",
        public_statistics,
        name="public-statistics",
    ),
]
