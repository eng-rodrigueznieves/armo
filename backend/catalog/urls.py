from django.urls import path

from .views import ProductDetailAPIView, ProductListAPIView


urlpatterns = [
    path("products/", ProductListAPIView.as_view(), name="product-list"),
    path("products/<int:product_id>/", ProductDetailAPIView.as_view(), name="product-detail"),
]