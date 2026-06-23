from django.contrib import admin

from .models import Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ["image", "alt_text", "is_primary"]


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "sku",
        "category",
        "price",
        "inventory_quantity",
        "recommended_space",
        "recommended_style",
        "is_active",
    ]
    list_filter = [
        "category",
        "recommended_space",
        "recommended_style",
        "is_active",
    ]
    search_fields = [
        "name",
        "sku",
        "category",
        "material",
        "color",
    ]
    readonly_fields = [
        "created_at",
        "updated_at",
    ]
    inlines = [ProductImageInline]

    fieldsets = [
        (
            "Product information",
            {
                "fields": [
                    "name",
                    "sku",
                    "category",
                    "description",
                    "is_active",
                ]
            },
        ),
        (
            "Pricing and inventory",
            {
                "fields": [
                    "price",
                    "inventory_quantity",
                ]
            },
        ),
        (
            "Dimensions",
            {
                "fields": [
                    "width",
                    "depth",
                    "height",
                ]
            },
        ),
        (
            "Material and recommendations",
            {
                "fields": [
                    "material",
                    "color",
                    "recommended_space",
                    "recommended_style",
                ]
            },
        ),
        (
            "System fields",
            {
                "fields": [
                    "created_at",
                    "updated_at",
                ]
            },
        ),
    ]


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = [
        "product",
        "is_primary",
        "created_at",
    ]
    list_filter = [
        "is_primary",
        "created_at",
    ]
    search_fields = [
        "product__name",
        "product__sku",
        "alt_text",
    ]